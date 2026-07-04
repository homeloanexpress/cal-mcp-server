/**
 * Tool registry for cal-mcp-server.  Each tool wraps a single executor
 * exposed by the Cal API at POST /askcal/tools/<name>.  Schemas mirror
 * the input_schema in askcal-tools.js so the client experience is the
 * same whether Cal is being driven from inside its own chat-loop or
 * from an MCP client.
 *
 * Adding a new tool = drop a file here that exports a CalTool, then
 * add it to the TOOLS array.
 */

import type { CalClient } from '../client.js';
import { calFactLookup } from './cal_fact_lookup.js';
import { calSearchLenders } from './cal_search_lenders.js';
import { calLenderDetails } from './cal_lender_details.js';
import { calLenderDocuments } from './cal_lender_documents.js';
import { calDpaSearch } from './cal_dpa_search.js';
import { calLenderIntel } from './cal_lender_intel.js';
import { calScenarioPattern } from './cal_scenario_pattern.js';
import { calValuation } from './cal_valuation.js';

export interface CalTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  run(client: CalClient, args: Record<string, unknown>): Promise<unknown>;
}

export const TOOLS: CalTool[] = [
  calFactLookup,
  calSearchLenders,
  calLenderDetails,
  calLenderDocuments,
  calDpaSearch,
  calLenderIntel,
  calScenarioPattern,
  calValuation,
];
