import type { CalTool } from './index.js';

export const calLenderDetails: CalTool = {
  name: 'cal_lender_details',
  description:
    'Fetch the full record for a specific wholesale lender — programs offered, state licenses, account-executive contact, broker portal URL, status, and recent matrix dates. ' +
    'Use this after cal_search_lenders to get contact details + portal info before recommending the lender to an LO.',
  inputSchema: {
    type: 'object',
    properties: {
      lenderSlug: {
        type: 'string',
        description: 'Canonical lowercase-with-dashes slug (e.g. "plaza-home-mortgage", "uwm", "carrington").',
      },
    },
    required: ['lenderSlug'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('get_lender_details', args);
  },
};
