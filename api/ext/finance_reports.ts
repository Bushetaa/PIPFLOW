import type { VercelRequest, VercelResponse } from '@vercel/node'
import { hasuraExec } from '../../server/hasura'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await hasuraExec<{ finance_reports: any[] }>(`
      query GetReports {
        finance_reports {
          news_count
          name
          source
          status
          created_at
          report_date_utc
          updated_at
          id
        }
      }
    `)
    res.status(200).json(data.finance_reports || [])
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message })
  }
}
