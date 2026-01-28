import type { VercelRequest, VercelResponse } from '@vercel/node'
import { hasuraExec } from '../../server/hasura'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await hasuraExec<{ finance_report_seo: any[] }>(`
      query GetReportSeo {
        finance_report_seo {
          secondary_keywords
          tags
          focus_keyword
          meta_description
          meta_title
          slug
          created_at
          report_id
        }
      }
    `)
    res.status(200).json(data.finance_report_seo || [])
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message })
  }
}
