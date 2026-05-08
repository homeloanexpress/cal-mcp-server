#!/usr/bin/env node
/**
 * cal-mcp-server — Model Context Protocol server for Cal, the AI mortgage
 * platform from HomeLoanExpress.
 *
 * Connects MCP-compatible clients (Claude Desktop, Cursor, Continue, Goose,
 * Zed, Cody, …) to Cal's lender library, DPA programs, lender intel, and
 * authoritative loan-limit / fee facts.  v0.1 ships seven tools mirroring
 * Cal's internal tool-use schema.  v0.2 adds OAuth 2.1 PKCE; v0.1 uses a
 * long-lived bearer token in `CAL_API_TOKEN`.
 *
 * Transport: stdio.  All MCP clients support stdio; HTTP transport will be
 * added in a later release.
 *
 * Usage:
 *   CAL_API_TOKEN=<token> npx @homeloanexpress/cal-mcp-server
 *
 * Or, in Claude Desktop's claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "cal": {
 *         "command": "npx",
 *         "args": ["-y", "@homeloanexpress/cal-mcp-server"],
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
const SERVER_VERSION = '0.1.1';

const DEFAULT_BASE_URL = 'https://vault.homeloanexpress.ai';

function loadConfig() {
  const baseUrl = process.env.CAL_API_BASE_URL || DEFAULT_BASE_URL;
  const token = process.env.CAL_API_TOKEN || '';
  if (!token) {
    process.stderr.write(
      [
        '',
        '  cal-mcp-server: missing CAL_API_TOKEN.',
        '',
        '  Get one by logging in at https://vault.homeloanexpress.ai',
        '  and copying your bearer token.  Then set it in your MCP client',
        '  config:',
        '',
        '    "env": { "CAL_API_TOKEN": "<token>" }',
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
