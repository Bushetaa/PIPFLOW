import type { VercelRequest, VercelResponse } from '@vercel/node'
import { storage } from '../../../../server/storage'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pair = req.query.pair as string
    if (!pair) {
      return res.status(400).json({ message: "Missing 'pair' parameter" })
    }
    await storage.seedInitialData()
    const ticker = await storage.getTicker(pair)
    if (!ticker) {
      return res.status(404).json({ message: "Ticker not found" })
    }
    res.status(200).json(ticker)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
