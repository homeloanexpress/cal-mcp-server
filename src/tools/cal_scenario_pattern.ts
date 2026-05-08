import type { CalTool } from './index.js';

export const calScenarioPattern: CalTool = {
  name: 'cal_scenario_pattern',
  description:
    'Fetch a structuring playbook for a recognized hard mortgage scenario — departing residence with property still listed, ITIN / foreign national, sub-580 FHA, renovation (203k / reno-perm), super-jumbo > $1M — or the matrix-freshness citation rule. ' +
    'Each pattern returns the recommended lender shortlist + the specific guideline to apply. ' +
    'Call this FIRST when the LO\'s question matches one of these patterns — it gives you the playbook before any lender search.',
  inputSchema: {
    type: 'object',
    properties: {
      pattern: {
        type: 'string',
        enum: [
          'departing-residence',
          'itin-foreign-national',
          'sub-580-fha',
          'renovation',
          'super-jumbo',
          'matrix-freshness',
        ],
        description:
          '"departing-residence" = jumbo + departing PITI + 30%+ down. ' +
          '"itin-foreign-national" = ITIN borrower or non-resident alien. ' +
          '"sub-580-fha" = FHA below the 580 minimum FICO. ' +
          '"renovation" = 203k / reno-perm / construction-to-perm. ' +
          '"super-jumbo" = loan amount over $1M. ' +
          '"matrix-freshness" = the citation rule for quoting any lender matrix.',
      },
    },
    required: ['pattern'],
    additionalProperties: false,
  },
  async run(client, args) {
    return client.invokeTool('lookup_scenario_pattern', args);
  },
};
