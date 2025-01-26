'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'


export function LandingNavbar() {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <nav className="container h-16 flex items-center justify-between">
        <span className="text-white"></span>
      </nav>
    </motion.header>
  )
}

