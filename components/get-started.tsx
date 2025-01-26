'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function GetStarted() {
  return (
    <section className="py-24">
      <motion.div 
        className="container max-w-[800px] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of students and professionals learning neural networks through our interactive platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/builder">
            <Button size="lg" className="gap-2">
              Launch Builder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/examples">
            <Button size="lg" variant="outline">
              Browse Examples
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          No account required to start building. Create one to save and share your work.
        </p>
      </motion.div>
    </section>
  )
}

