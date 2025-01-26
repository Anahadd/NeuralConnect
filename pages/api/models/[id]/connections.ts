import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Model } from '@/models/Model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await connectDB()

  switch (req.method) {
    case 'GET':
      try {
        const model = await Model.findById(id)
        if (!model) {
          return res.status(404).json({ error: 'Model not found' })
        }
        return res.status(200).json(model.connections)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch connections' })
      }

    case 'PUT':
      try {
        const model = await Model.findByIdAndUpdate(
          id,
          { $set: { connections: req.body, updatedAt: new Date() } },
          { new: true, runValidators: true }
        )
        if (!model) {
          return res.status(404).json({ error: 'Model not found' })
        }
        return res.status(200).json(model.connections)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update connections' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 