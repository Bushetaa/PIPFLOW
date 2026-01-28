import type { VercelRequest, VercelResponse } from '@vercel/node'
import { hasuraExec } from '../../server/hasura'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await hasuraExec<{ finance_news_items: any[] }>(`
      query GetNewsItems {
        finance_news_items {
          raw_json
          link
          published_at_raw
          summary
          title
          created_at
          published_at
          id
          report_id
        }
      }
    `)
    res.status(200).json(data.finance_news_items || [])
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message })
  }
}
