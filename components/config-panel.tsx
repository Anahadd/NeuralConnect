'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBuilderStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

export function ConfigPanel() {
  const selectedNode = useBuilderStore(state => {
    const selectedId = state.selectedNode
    return selectedId ? state.nodes.find(n => n.id === selectedId) : null
  })

  const updateNode = useBuilderStore(state => state.updateNode)

  if (!selectedNode) {
    return (
      <motion.div 
        className="w-80 border-l border-border bg-muted/50 p-4"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
      >
        <div className="text-center text-muted-foreground">
          Select a layer to configure its parameters
        </div>
      </motion.div>
    )
  }

  const configs = {
    input: {
      shape: { type: 'input', label: 'Input Shape' },
      batchSize: { type: 'input', label: 'Batch Size' }
    },
    hidden: {
      units: { type: 'slider', label: 'Units', min: 1, max: 1000 },
      activation: { type: 'select', label: 'Activation', options: ['relu', 'sigmoid', 'tanh'] }
    },
    output: {
      units: { type: 'slider', label: 'Units', min: 1, max: 1000 },
      activation: { type: 'select', label: 'Activation', options: ['softmax', 'sigmoid'] }
    },
    conv2d: {
      filters: { type: 'slider', label: 'Filters', min: 1, max: 256 },
      kernelSize: { type: 'input', label: 'Kernel Size' },
      strides: { type: 'input', label: 'Strides' }
    }
  }

  const nodeConfigs = configs[selectedNode.type as keyof typeof configs] || {}

  return (
    <motion.div 
      className="w-80 border-l border-border bg-muted/50 p-4"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Layer Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Layer Name</Label>
              <Input 
                value={selectedNode.data.label}
                onChange={(e) => updateNode(selectedNode.id, {
                  data: { ...selectedNode.data, label: e.target.value }
                })}
              />
            </div>

            {Object.entries(nodeConfigs).map(([key, config]) => (
              <div key={key} className="space-y-2">
                <Label>{config.label}</Label>
                {config.type === 'input' && (
                  <Input 
                    value={selectedNode.data.config[key] || ''}
                    onChange={(e) => updateNode(selectedNode.id, {
                      data: {
                        ...selectedNode.data,
                        config: { ...selectedNode.data.config, [key]: e.target.value }
                      }
                    })}
                  />
                )}
                {config.type === 'slider' && (
                  <Slider 
                    value={[selectedNode.data.config[key] || config.min]}
                    min={config.min}
                    max={config.max}
                    step={1}
                    onValueChange={([value]) => updateNode(selectedNode.id, {
                      data: {
                        ...selectedNode.data,
                        config: { ...selectedNode.data.config, [key]: value }
                      }
                    })}
                  />
                )}
              </div>
            ))}

            <div className="flex items-center justify-between">
              <Label>Trainable</Label>
              <Switch 
                checked={selectedNode.data.config.trainable !== false}
                onCheckedChange={(checked) => updateNode(selectedNode.id, {
                  data: {
                    ...selectedNode.data,
                    config: { ...selectedNode.data.config, trainable: checked }
                  }
                })}
              />
            </div>
          </div>
        </div>

        <Button className="w-full">Apply Changes</Button>
      </div>
    </motion.div>
  )
}

