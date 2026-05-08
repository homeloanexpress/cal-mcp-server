import type { CalTool } from './index.js';

export const calSearchLenders: CalTool = {
  name: 'cal_search_lenders',
  description:
    'Search Cal\'s scoped wholesale-lender library for programs that fit a loan scenario. ' +
    'Returns lenders ranked best-first with score, qualifying reasons, and any blockers ' +
    '(state license gaps, FICO/LTV overlays). Use this for any "who does X?" or "which lender for Y?" question — ' +
    'pass as much scenario detail as you have (FICO, LTV, loan amount, occupancy) and Cal will rank against the live library. ' +
    'Defaults to top 5; pass expand=true for top 15.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description:
          'Product category. One of: DSCR, Non-QM, Jumbo, Conventional, FHA, VA, Bank-Statement, ITIN, HELOC, USDA, Reverse, Renovation. Required.',
      },
      state: {
        type: 'string',
        description: 'Two-letter US state code (e.g. "CA"). Optional but improves ranking.',
        pattern: '^[A-Z]{2}$',
      },
      fico: {
        type: 'integer',
        description: 'Borrower FICO. Used to filter out lenders whose floor is higher.',
      },
      ltv: {
        type: 'number',
        description: 'Loan-to-value as a percentage (e.g. 80 for 80% LTV).',
      },
      loanAmount: {
        type: 'number',
        description: 'Loan amount in USD. Used to filter against lender min/max bounds.',
      },
      occupancy: {
        type: 'string',
        enum: ['primary', 'second_home', 'investment'],
        description: 'Property occupancy.',
      },
      subProgram: {
        type: 'string',
        description: 'Optional product sub-type (e.g. "DPA", "HomeReady", "203k", "Bank-Statement-12mo").',
      },
      includeBlocked: {
        type: 'boolean',
        description: 'Include lenders that have blockers in the result (default false).',
      },
      expand: {
        type: 'boolean',
        description: 'Return top 15 instead of the default top 5.',
      },
    },
    required: ['category'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('search_lenders_by_product', args);
  },
};
