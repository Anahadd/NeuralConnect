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
        return res.status(200).json(model)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch model' })
      }

    case 'PUT':
      try {
        const model = await Model.findByIdAndUpdate(id, req.body, { 
          new: true,
          runValidators: true 
        })
        if (!model) {
          return res.status(404).json({ error: 'Model not found' })
        }
        return res.status(200).json(model)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update model' })
      }

    case 'DELETE':
      try {
        const model = await Model.findByIdAndDelete(id)
        if (!model) {
          return res.status(404).json({ error: 'Model not found' })
        }
        return res.status(200).json({ message: 'Model deleted successfully' })
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete model' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 