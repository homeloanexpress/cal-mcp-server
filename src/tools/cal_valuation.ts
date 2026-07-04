import type { CalTool } from './index.js';

export const calValuation: CalTool = {
  name: 'cal_valuation',
  description:
    'ValueGuard: run a comparable-sales valuation on a subject property and return a list-price rebuttal. ' +
    'Given the subject (address, list price, square footage) and at least 4 comparable listings, returns the ' +
    'indicated market value with a floor/ceiling range, a verdict (overpriced / at market / underpriced), a ' +
    'confidence level, the percent the list price sits above or below market, and the comps used. ' +
    'Use this for "is this list price fair", "what is this home worth", appraisal-gap or list-price-rebuttal ' +
    'questions. The caller must supply the comparable listings; this tool does not fetch comps.',
  inputSchema: {
    type: 'object',
    properties: {
      subject: {
        type: 'object',
        description:
          'The subject property. Include address (or id), price (list price, number), and sqft (number). ' +
          'Optional: lotSqft, beds, baths, pool, year, zip.',
        properties: {
          address: { type: 'string', description: 'Street address or label for the subject property.' },
          price: { type: 'number', description: 'List price in dollars.' },
          sqft: { type: 'number', description: 'Gross living area in square feet.' },
        },
        required: ['price', 'sqft'],
      },
      listings: {
        type: 'array',
        description:
          'At least 4 comparable listings, each an object with the same shape as subject ' +
          '(address/price/sqft, optional lotSqft/beds/baths/pool/year/zip). More comps = higher confidence.',
        items: { type: 'object' },
        minItems: 4,
      },
      opts: {
        type: 'object',
        description:
          'Optional tuning: K (number of nearest comps, default 6) and lotCap/bathFlat/poolFlat adjustment ' +
          'overrides. Omit for defaults.',
      },
    },
    required: ['subject', 'listings'],
  },
  async run(client, args) {
    return client.invokeTool('valuation_report', args);
  },
};
