'use client'

import { useCallback, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { motion } from 'framer-motion'
import { useBuilderStore } from '@/lib/store'
import { NetworkNode } from './network-node'
import { Connection } from './connection'
import { shallow } from 'zustand/shallow'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const {
    nodes,
    connections,
    addNode,
    isDragging,
    setIsDragging,
    isConnecting,
    connectionStart,
    addConnection,
    setConnectionStart,
    setIsConnecting
  } = useBuilderStore(
    state => ({
      nodes: state.nodes,
      connections: state.connections,
      addNode: state.addNode,
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
      isConnecting: state.isConnecting,
      connectionStart: state.connectionStart,
      addConnection: state.addConnection,
      setConnectionStart: state.setConnectionStart,
      setIsConnecting: state.setIsConnecting
    }),
    shallow
  )

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('application/neural-connect')
    if (!type) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    addNode(type as any, { x, y })
  }, [addNode])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleCanvasClick = useCallback(() => {
    if (isConnecting) {
      setIsConnecting(false)
      setConnectionStart(null)
    }
  }, [isConnecting, setIsConnecting, setConnectionStart])

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        wheel={{ disabled: isDragging || isConnecting }}
        pan={{ disabled: isDragging || isConnecting }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full"
        >
          <div className="w-full h-full bg-[#1a1f36] relative">
            {/* Grid background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Nodes */}
            {nodes.map(node => (
              <NetworkNode
                key={node.id}
                node={node}
              />
            ))}

            {/* Connections */}
            {connections.map(connection => (
              <Connection
                key={connection.id}
                connection={connection}
              />
            ))}

            {/* Active connection line */}
            {isConnecting && connectionStart && (
              <motion.div
                className="absolute w-2 h-2 bg-primary rounded-full"
                animate={{ x: connectionStart.x, y: connectionStart.y }}
              />
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

