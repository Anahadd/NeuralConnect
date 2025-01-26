import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Model } from '@/models/Model'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { id } = req.query
  await connectDB()

  try {
    const { filename, size, displayName } = req.body
    const dataset = {
      name: filename,
      size: size,
      uploadedAt: new Date(),
      filename: filename,
      displayName: displayName
    }

    const model = await Model.findByIdAndUpdate(
      id,
      { 
        $set: { 
          dataset,
          hasDataset: true,
          updatedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    )

    if (!model) {
      return res.status(404).json({ error: 'Model not found' })
    }

    return res.status(200).json({ dataset: model.dataset })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload dataset' })
  }
} 