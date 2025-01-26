'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { Brain, Trash2 } from 'lucide-react'
import { Node, useBuilderStore } from '@/lib/store'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from '@/lib/utils'

interface NetworkNodeProps {
  node: Node
}

export function NetworkNode({ node }: NetworkNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const {
    removeNode,
    setSelectedNode,
    setIsConnecting,
    setConnectionStart,
    addConnection,
    connectionStart
  } = useBuilderStore()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: node
  })

  const handleConnectionStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsConnecting(true)
    setConnectionStart(node.id)
  }

  const handleConnectionEnd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connectionStart && connectionStart !== node.id) {
      addConnection(connectionStart, node.id)
    }
    setIsConnecting(false)
    setConnectionStart(null)
  }

  const nodeColors = {
    input: 'border-blue-500 bg-blue-500/10',
    hidden: 'border-purple-500 bg-purple-500/10',
    output: 'border-green-500 bg-green-500/10',
    conv2d: 'border-orange-500 bg-orange-500/10',
    maxpool: 'border-pink-500 bg-pink-500/10',
    flatten: 'border-yellow-500 bg-yellow-500/10'
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          ref={setNodeRef}
          className={cn(
            "absolute cursor-grab active:cursor-grabbing",
            "w-40 rounded-lg border-2 bg-background/95 backdrop-blur-sm p-4",
            nodeColors[node.type]
          )}
          style={{
            left: node.position.x,
            top: node.position.y,
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
          }}
          onClick={() => setSelectedNode(node.id)}
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center justify-between mb-2">
            <Brain className="h-5 w-5" />
            <div className="flex space-x-2">
              <div
                className="w-3 h-3 rounded-full bg-primary cursor-pointer"
                onClick={handleConnectionStart}
                onMouseUp={handleConnectionEnd}
              />
            </div>
          </div>
          <div className="text-sm font-medium">{node.data.label}</div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => removeNode(node.id)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

