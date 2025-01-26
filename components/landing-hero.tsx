'use client'

import { motion, useMotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function LandingHero() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-32 px-4 bg-gradient-to-b from-[#1A1A1A] via-[#2D1B69] to-[#1A1A1A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400 backdrop-blur-sm border border-white/10 mb-8">
          <span className="mr-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">UW</span>
          GeeseHacks 2025
        </div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            drag
            dragMomentum={false}
            style={{ x, y }}
            className="cursor-move relative"
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            
            <h1 className="text-[64px] leading-tight font-medium tracking-tight">
              <div className="font-bold text-[72px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                Make Neural Networks
              </div>
              <div className="inline-flex items-center">
                <span className="bg-white/10 px-6 py-2 rounded-lg">
                  10x Faster with Drag & Drop
                </span>
              </div>
            </h1>
          </motion.div>
          
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
            NeuralConnect empowers students and researchers to design, train, and deploy
            neural networks through an intuitive visual interface.
          </p>

          <Link 
            href="/dashboard"
            className="inline-flex items-center mt-8 bg-[#7C3AED] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#9D5CFF] transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

