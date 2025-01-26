'use client'

import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export function Logo() {
  return (
    <>
      <motion.div
        whileHover={{ rotate: -10, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="relative w-12 h-12 flex items-center justify-center"
      >
        <Brain className="w-full h-full text-white" />
      </motion.div>
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold tracking-tight text-white"
        style={{ fontFamily: 'var(--font-inter)' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        NeuralConnect
      </motion.span>
    </>
  )
}

