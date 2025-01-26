'use client'

import { useCallback, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeTypes,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { LayerNode } from './layer-node'
import { Connection as CustomConnection } from './connection'
import { useBuilderStore } from '@/lib/store'
import { useSearchParams } from 'next/navigation'
import { shallow } from 'zustand/shallow'

const nodeTypes: NodeTypes = {
  layerNode: LayerNode,
}

const edgeTypes = {
  custom: CustomConnection,
}

export function MainCanvas() {
  const searchParams = useSearchParams()
  const modelId = searchParams?.get('id')
  
  // Get nodes directly from store
  const storeNodes = useBuilderStore((state) => state.nodes, shallow)
  const { addNode, removeNode, updateNode, setNodes: setStoreNodes } = useBuilderStore()
  
  // Initialize ReactFlow state with store nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { project } = useReactFlow()

  // Sync ReactFlow nodes with store nodes
  useEffect(() => {
    if (storeNodes && storeNodes.length > 0) {
      console.log('Syncing nodes from store:', storeNodes)
      setNodes(storeNodes)
    }
  }, [storeNodes, setNodes])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes)
    
    changes.forEach((change: any) => {
      if (change.type === 'add') {
        addNode(change.item)
      } else if (change.type === 'remove') {
        removeNode(change.id)
      } else if (change.type === 'position' || change.type === 'dimensions') {
        updateNode(change.id, change)
      }
    })
    
    const currentNodes = nodes
    useBuilderStore.setState({ nodes: currentNodes })
  }, [nodes, addNode, removeNode, updateNode, onNodesChange])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const nodeData = event.dataTransfer.getData('application/reactflow')

      if (!nodeData) return

      const { type, name } = JSON.parse(nodeData)
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: String(Date.now()),
        type: 'layerNode',
        position,
        data: { label: name, type: type },
      }

      // Add to both ReactFlow and store
      setNodes((nds) => nds.concat(newNode))
      addNode(newNode)
    },
    [project, addNode, setNodes]
  )

  return (
    <div className="flex-1 bg-[#1A1A1A]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
        fitView
        className="react-flow-dark"
      >
        <Controls className="react-flow-controls-dark" />
        <MiniMap className="react-flow-minimap-dark" />
        <Background color="#2D2D2D" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

