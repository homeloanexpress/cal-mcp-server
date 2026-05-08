import type { CalTool } from './index.js';

export const calDpaSearch: CalTool = {
  name: 'cal_dpa_search',
  description:
    'Find Down Payment Assistance (DPA) programs for a borrower\'s state, county, FTHB status, and program type. ' +
    'Returns up to 25 ranked programs with provider URLs, eligibility, amount, and program type (grant / forgivable / deferred / second / MCC). ' +
    'Use this for any "DPA in <state>", "first-time buyer help in <county>", grant, forgivable second, MCC, or any city/county/state housing-finance-agency program question.',
  inputSchema: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'Two-letter US state code (e.g. "CA"). Use "ALL" or omit for national programs.',
      },
      county: {
        type: 'string',
        description: 'Optional county name (lowercase). Filters to programs that explicitly cover that county.',
      },
      city: {
        type: 'string',
        description: 'Optional city name (lowercase). Filters to city-level programs.',
      },
      fthb: {
        type: 'boolean',
        description: 'Filter to first-time-homebuyer-only programs. Omit to include both FTHB and non-FTHB.',
      },
      type: {
        type: 'string',
        enum: ['grant', 'forgivable_loan', 'deferred_loan', 'second_loan', 'mortgage_credit_certificate', 'any'],
        description: 'Optional program-type filter.',
      },
    },
    required: [],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('search_programs', args);
  },
};
