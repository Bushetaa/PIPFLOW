import { z } from 'zod';
import { insertAnalysisReportSchema, marketData, analysisReports } from './schema';

export { insertAnalysisReportSchema, insertMarketDataSchema } from './schema';
export type { InsertAnalysisReport, InsertMarketData } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  market: {
    overview: {
      method: 'GET' as const,
      path: '/api/market/overview',
      responses: {
        200: z.array(z.custom<typeof marketData.$inferSelect>()),
      },
    },
    ticker: {
        method: 'GET' as const,
        path: '/api/market/ticker/:pair',
        responses: {
            200: z.custom<typeof marketData.$inferSelect>(),
            404: errorSchemas.notFound,
        }
    }
  },
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      input: z.object({
        pair: z.string().optional(),
        sentiment: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof analysisReports.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: insertAnalysisReportSchema,
      responses: {
        201: z.custom<typeof analysisReports.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
