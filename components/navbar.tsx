'use client'

import { Brain } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function BuilderNavbar() {
  return (
    <motion.header 
      className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <nav className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">NeuralConnect</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">Export to PyTorch</Button>
          <Button variant="outline">Export to TensorFlow</Button>
          <Button>Run Model</Button>
        </div>
      </nav>
    </motion.header>
  )
}

