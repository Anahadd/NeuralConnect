'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Camera, Hand, Maximize2, Play, ZoomIn, ZoomOut } from 'lucide-react'

export function Toolbar() {
  return (
    <motion.div 
      className="h-12 border-b border-border bg-muted/50 flex items-center justify-center space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center bg-background/50 rounded-lg p-1 space-x-1">
        <Button variant="ghost" size="icon">
          <Hand className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Camera className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <Button size="sm" className="gap-2">
        <Play className="h-4 w-4" />
        Run Model
      </Button>
    </motion.div>
  )
}

