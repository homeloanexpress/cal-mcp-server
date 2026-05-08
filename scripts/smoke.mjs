#!/usr/bin/env node
/**
 * Standalone smoke test.  Spawns the built MCP server over stdio,
 * issues an initialize handshake, lists tools, and exercises each
 * one against the live Cal API.
 *
 * Run: CAL_API_TOKEN=<token> node scripts/smoke.mjs
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverEntry = resolve(__dirname, '..', 'dist', 'index.js');

const token = process.env.CAL_API_TOKEN;
if (!token) {
  console.error('CAL_API_TOKEN env var required. Get one from /auth/login.');
  process.exit(1);
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverEntry],
  env: { ...process.env, CAL_API_TOKEN: token },
});

const client = new Client(
  { name: 'cal-mcp-smoke', version: '0.1.0' },
  { capabilities: {} }
);

await client.connect(transport);

const list = await client.listTools();
console.log(`✓ tools/list — ${list.tools.length} tools: ${list.tools.map((t) => t.name).join(', ')}\n`);

const cases = [
  {
    label: 'cal_fact_lookup · Alameda CA conforming',
    name: 'cal_fact_lookup',
    args: { category: 'conforming_loan_limit', state: 'CA', county: 'alameda', units: 1 },
    expect: (r) => /1229100|1,229,100/.test(r) && /FHFA/.test(r),
  },
  {
    label: 'cal_fact_lookup · VA funding fee first-use',
    name: 'cal_fact_lookup',
    args: { category: 'va_funding_fee', va_use_count: 'first_use', va_down_payment_pct: 0 },
    expect: (r) => /38 USC 3729|funding_fee/.test(r),
  },
  {
    label: 'cal_search_lenders · Jumbo CA',
    name: 'cal_search_lenders',
    args: { category: 'Jumbo', state: 'CA' },
    expect: (r) => /count|results|slug/.test(r),
  },
  {
    label: 'cal_dpa_search · CA FTHB',
    name: 'cal_dpa_search',
    args: { state: 'CA', fthb: true },
    expect: (r) => /programs|count/.test(r),
  },
  {
    label: 'cal_scenario_pattern · super-jumbo',
    name: 'cal_scenario_pattern',
    args: { pattern: 'super-jumbo' },
    expect: (r) => /topLenders|nextStep|summary/.test(r),
  },
  {
    label: 'cal_lender_details · plaza-home-mortgage',
    name: 'cal_lender_details',
    args: { lenderSlug: 'plaza-home-mortgage' },
    expect: (r) => /plaza|name|status/i.test(r),
  },
  {
    label: 'cal_lender_documents · plaza-home-mortgage',
    name: 'cal_lender_documents',
    args: { lenderSlug: 'plaza-home-mortgage' },
    expect: (r) => /documents|count|filename/.test(r),
  },
  {
    label: 'cal_lender_intel · plaza-home-mortgage strengths',
    name: 'cal_lender_intel',
    args: { lenderSlug: 'plaza-home-mortgage', intent: 'strengths' },
    expect: (r) => /hasIntel|strengths|note/.test(r),
  },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  process.stdout.write(`  ${c.label.padEnd(58)} `);
  try {
    const t0 = Date.now();
    const r = await client.callTool({ name: c.name, arguments: c.args });
    const text = r.content?.map((b) => b.text).join('\n') || '';
    if (r.isError) {
      console.log(`✗ tool error: ${text.slice(0, 80)}`);
      fail++;
    } else if (!c.expect(text)) {
      console.log(`✗ assertion missed (${(Date.now() - t0)}ms)\n     ${text.slice(0, 200)}`);
      fail++;
    } else {
      console.log(`✓ ${(Date.now() - t0)}ms`);
      pass++;
    }
  } catch (err) {
    console.log(`✗ exception: ${err.message}`);
    fail++;
  }
}

console.log(`\n${pass} pass · ${fail} fail`);
await client.close();
process.exit(fail > 0 ? 1 : 0);
