import type { CalTool } from './index.js';

export const calLenderIntel: CalTool = {
  name: 'cal_lender_intel',
  description:
    'Tribal-knowledge intelligence on a specific wholesale lender — strengths, watch-outs, speed notes, scenarios they love, scenarios to avoid, AE contacts, recent overlay shifts not yet in PDFs. ' +
    'Use this AFTER cal_lender_details when the user asks "is this lender any good for X?", "fastest path", "what gets denied", or any qualitative question about working with the lender. ' +
    'Pass an `intent` to narrow the response and save tokens — e.g. intent="scenariosTheyLove" returns just that field.',
  inputSchema: {
    type: 'object',
    properties: {
      lenderSlug: {
        type: 'string',
        description: 'Canonical lowercase-with-dashes slug. Match what cal_lender_details uses.',
      },
      intent: {
        type: 'string',
        enum: ['strengths', 'watchOuts', 'speedNotes', 'scenariosTheyLove', 'scenariosToAvoid', 'aeContacts', 'all'],
        description:
          'Narrow the response to one section. Defaults to "all" (full record). ' +
          'Prefer a narrow intent for hard scenarios — e.g. for "is X good for departing residence?" pass "scenariosTheyLove".',
      },
    },
    required: ['lenderSlug'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('lookup_lender_intel', args);
  },
};
