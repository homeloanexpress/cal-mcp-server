import type { CalTool } from './index.js';

export const calLenderDocuments: CalTool = {
  name: 'cal_lender_documents',
  description:
    'List indexed matrix / handbook / overlay documents for a lender. ' +
    'Returns each doc\'s filename, effective date, product category, authority (master vs. supplement), ' +
    'superseded flag, and a short extracted summary. Sorted: master → current → superseded last. ' +
    'Use this to verify program details or cite a specific matrix version when answering an LO question.',
  inputSchema: {
    type: 'object',
    properties: {
      lenderSlug: {
        type: 'string',
        description: 'Canonical lowercase-with-dashes slug (matches cal_lender_details).',
      },
    },
    required: ['lenderSlug'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('get_lender_documents', args);
  },
};
