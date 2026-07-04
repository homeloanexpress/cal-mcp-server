#!/usr/bin/env node
/**
 * cal-mcp-server — Model Context Protocol server for Cal, the AI mortgage
 * platform at askcal.io.
 *
 * Connects MCP-compatible clients (Claude Desktop, Cursor, Continue, Goose,
 * Zed, Cody, …) to Cal's lender library, DPA programs, lender intel, ValueGuard
 * valuations, and authoritative loan-limit / fee facts.  Ships eight tools
 * mirroring Cal's internal tool-use schema.  A later release adds OAuth 2.1
 * PKCE; today it uses a long-lived bearer token in `CAL_API_TOKEN`.
 *
 * Transport: stdio.  All MCP clients support stdio; HTTP transport will be
 * added in a later release.
 *
 * Usage:
 *   CAL_API_TOKEN=<token> npx @askcal/mcp-server
 *
 * Or, in Claude Desktop's claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "cal": {
 *         "command": "npx",
 *         "args": ["-y", "@askcal/mcp-server"],
 *         "env": { "CAL_API_TOKEN": "<token>" }
 *       }
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { CalClient } from './client.js';
import { TOOLS } from './tools/index.js';

const SERVER_NAME = 'cal-mcp-server';
const SERVER_VERSION = '0.2.0';

const DEFAULT_BASE_URL = 'https://api.askcal.io';

function loadConfig() {
  const baseUrl = process.env.CAL_API_BASE_URL || DEFAULT_BASE_URL;
  const token = process.env.CAL_API_TOKEN || '';
  if (!token) {
    process.stderr.write(
      [
        '',
        '  cal-mcp-server: missing CAL_API_TOKEN.',
        '',
        '  Set your Cal API key so the server can reach the Cal API:',
        '',
        '    "env": { "CAL_API_TOKEN": "cal_live_..." }',
        '',
        '  Need a key?  Start a free Cal trial at https://askcal.io and open',
        '  your API keys, then set CAL_API_TOKEN above',
        '',
      ].join('\n')
    );
    process.exit(1);
  }
  return { baseUrl, token };
}

async function main() {
  const { baseUrl, token } = loadConfig();
  const client = new CalClient({ baseUrl, token });

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      };
    }
    try {
      const result = await tool.run(client, args ?? {});
      return {
        content: [
          { type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: 'text', text: `Tool ${name} failed: ${msg}` }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.stderr.write(
    `cal-mcp-server v${SERVER_VERSION} ready · ${TOOLS.length} tools · base=${baseUrl}\n`
  );
}

main().catch((err) => {
  process.stderr.write(`cal-mcp-server fatal: ${err?.stack || err}\n`);
  process.exit(1);
});
