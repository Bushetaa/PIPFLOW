import type { VercelRequest, VercelResponse } from '@vercel/node'
import { storage } from '../../../server/storage'
import { z } from 'zod'
import { insertAnalysisReportSchema } from '../../../shared/schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const pair = (req.query.pair as string) || undefined
      const sentiment = (req.query.sentiment as string) || undefined
      await storage.seedInitialData()
      const reports = await storage.getReports(pair, sentiment)
      return res.status(200).json(reports)
    }

    if (req.method === 'POST') {
      try {
        const input = insertAnalysisReportSchema.parse(req.body)
        const report = await storage.createReport(input)
        return res.status(201).json(report)
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0]?.message || 'Validation error',
            field: err.errors[0]?.path?.join('.') || undefined,
          })
        }
        throw err
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
