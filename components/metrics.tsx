'use client'

import { useState, useEffect } from "react"
import { Files, Play } from 'lucide-react'

interface ModelStats {
  total_models: number
  active_models: number
}

const getMetrics = (stats: ModelStats) => {
  return [
    {
      name: 'Total Models',
      value: stats.total_models.toString(),
      icon: Files,
      color: 'bg-purple-600',
    },
    {
      name: 'Active Models',
      value: stats.active_models.toString(),
      icon: Play,
      color: 'bg-green-600',
    },
  ]
}

export function DashboardMetrics() {
  const [stats, setStats] = useState<ModelStats>({
    total_models: 0,
    active_models: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/models/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const metrics = getMetrics(stats)

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="p-6 bg-[#1A1B2E] rounded-lg border border-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className={`${metric.color} p-3 rounded-full`}>
              <metric.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{metric.name}</p>
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

