import type { VercelRequest, VercelResponse } from '@vercel/node'
import { storage } from '../../../server/storage'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await storage.seedInitialData()
    const data = await storage.getMarketOverview()
    res.status(200).json(data)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
