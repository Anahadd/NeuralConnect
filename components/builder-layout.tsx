'use client'

import { useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useSearchParams } from 'next/navigation'
import { BuilderNavbar } from './builder-navbar'
import { LeftSidebar } from './left-sidebar'
import { MainCanvas } from './main-canvas'
import { RightSidebar } from './right-sidebar'
import { useBuilderStore } from '@/lib/store'

export function BuilderLayout() {
  const searchParams = useSearchParams()
  const modelId = searchParams?.get('id')
  const setNodes = useBuilderStore((state) => state.setNodes)

  // Fetch nodes immediately when builder loads
  useEffect(() => {
    const fetchNodes = async () => {
      if (!modelId) return

      try {
        console.log('Fetching nodes for model:', modelId)
        const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes`)
        if (!response.ok) throw new Error('Failed to fetch nodes')
        
        const data = await response.json()
        console.log('Fetched nodes:', data)
        
        // Ensure we're setting valid nodes data
        if (data && Array.isArray(data.nodes)) {
          console.log('Setting nodes in store:', data.nodes)
          setNodes(data.nodes)
        }
      } catch (error) {
        console.error('Error fetching nodes:', error)
      }
    }

    // Immediate fetch
    fetchNodes()
  }, [modelId, setNodes])

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] text-white">
      <BuilderNavbar />
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <LeftSidebar />
          <MainCanvas />
          <RightSidebar />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

