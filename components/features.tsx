'use client'

import { motion } from 'framer-motion'
import { Brain, Code2, Lightbulb, Share2 } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "Visual Learning",
    description: "Understand neural networks through an intuitive visual interface. Perfect for beginners and experts alike."
  },
  {
    icon: Code2,
    title: "Export to Code",
    description: "Generate production-ready PyTorch or TensorFlow code from your visual designs with one click."
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share your models with the community and learn from others. Fork and modify existing architectures."
  },
  {
    icon: Lightbulb,
    title: "Interactive Tutorials",
    description: "Learn neural network concepts through hands-on tutorials and real-time visualization."
  }
]

export function Features() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Learn by Building</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            NeuralConnect makes it easy to understand and experiment with neural networks
            through a visual, interactive interface.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5 rounded-lg blur-lg group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-background/95 backdrop-blur-sm p-6 rounded-lg border border-border">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

