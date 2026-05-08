/**
 * cal_fact_lookup — authoritative current-data lookup for the numbers
 * loan officers reach for daily: FHFA conforming limits, FHA county
 * limits, VA funding fee, FHA MIP, and agency DTI caps.  Backed by
 * Cal's curated 2026 facts file (sourced from FHFA, HUD, VA, Fannie,
 * Freddie).
 *
 * Why this is the smoke-test tool: smallest schema, no listId scoping
 * dependency, returns a structured fact + source citation.  If this
 * works end-to-end through Claude Desktop, the wedge is proven and the
 * remaining six tools are mechanical wrappers.
 */

import type { CalTool } from './index.js';

export const calFactLookup: CalTool = {
  name: 'cal_fact_lookup',
  description:
    'Look up authoritative 2026 mortgage facts: FHFA conforming loan limits, FHA loan limits, VA funding fee schedule, FHA MIP rates, and agency DTI caps. ' +
    'Use this whenever you need a specific dollar amount, percentage, or threshold — never quote these from training-data memory because the values reset annually and FHFA/FHA limits are different programs. ' +
    'Returns the requested value with a source citation (FHFA, HUD, VA, Fannie/Freddie). ' +
    'Coverage: all 50 US states + DC, all county-level limits, 1-4 unit properties.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: [
          'conforming_loan_limit',
          'fha_loan_limit',
          'va_funding_fee',
          'fha_mip',
          'agency_dti_cap',
        ],
        description:
          'Which fact to look up. ' +
          '"conforming_loan_limit" = FHFA limit for conventional / Fannie / Freddie loans. ' +
          '"fha_loan_limit" = HUD/FHA limit (different program from FHFA). ' +
          '"va_funding_fee" = current VA funding fee table. ' +
          '"fha_mip" = current FHA MIP rates (upfront + annual). ' +
          '"agency_dti_cap" = baseline DTI caps per program.',
      },
      state: {
        type: 'string',
        description:
          'Two-letter US state code (e.g. "CA", "NY"). Required for conforming and FHA loan limits.',
        pattern: '^[A-Z]{2}$',
      },
      county: {
        type: 'string',
        description:
          'County name. Lowercase with underscores (e.g. "alameda", "los_angeles", "santa_clara"). Required for loan limits. Cal accepts spaces or underscores; both work.',
      },
      units: {
        type: 'integer',
        description: 'Number of units (1-4). Defaults to 1 for loan limits.',
        minimum: 1,
        maximum: 4,
      },
      va_use_count: {
        type: 'string',
        enum: ['first_use', 'subsequent_use', 'irrrl', 'cash_out_first', 'cash_out_subsequent'],
        description: 'For va_funding_fee — which fee schedule to look up.',
      },
      va_down_payment_pct: {
        type: 'number',
        description: 'For va_funding_fee — down payment % (used to pick the bracket).',
      },
    },
    required: ['category'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('lookup_fact', args);
  },
};
