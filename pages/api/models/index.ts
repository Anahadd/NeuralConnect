import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Model } from '@/models/Model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  switch (req.method) {
    case 'GET':
      try {
        const models = await Model.find({}).sort({ updatedAt: -1 })
        return res.status(200).json(models)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch models' })
      }

    case 'POST':
      try {
        const model = await Model.create(req.body)
        return res.status(201).json(model)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create model' })
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 