'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Box, FileInputIcon as InputIcon, BarChart3, Cpu, Repeat, ArrowRightLeft, Eraser, Layers, ArrowLeftRight, Shield, Minimize2, Maximize2, Shuffle } from 'lucide-react'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useBuilderStore } from '@/lib/store'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const layerCategories = [
  {
    name: 'Input/Output',
    layers: [
      { name: 'Input', icon: InputIcon, color: 'bg-blue-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'Output', icon: BarChart3, color: 'bg-green-500', types: ['cnn', 'rnn', 'feedforward'] },
    ]
  },
  {
    name: 'Core',
    layers: [
      { name: 'Dense', icon: Box, color: 'bg-purple-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'Activation', icon: ArrowRightLeft, color: 'bg-yellow-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'Dropout', icon: Eraser, color: 'bg-red-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'BatchNormalization', icon: Layers, color: 'bg-indigo-500', types: ['cnn', 'feedforward'] },
    ]
  },
  {
    name: 'Convolutional',
    layers: [
      { name: 'Conv1D', icon: Cpu, color: 'bg-orange-500', types: ['cnn'] },
      { name: 'Conv2D', icon: Cpu, color: 'bg-orange-500', types: ['cnn'] },
      { name: 'Conv3D', icon: Cpu, color: 'bg-orange-500', types: ['cnn'] },
      { name: 'MaxPooling1D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
      { name: 'MaxPooling2D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
      { name: 'MaxPooling3D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
      { name: 'AveragePooling1D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
      { name: 'AveragePooling2D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
      { name: 'AveragePooling3D', icon: Repeat, color: 'bg-pink-500', types: ['cnn'] },
    ]
  },
  {
    name: 'Recurrent',
    layers: [
      { name: 'SimpleRNN', icon: Repeat, color: 'bg-indigo-500', types: ['rnn'] },
      { name: 'LSTM', icon: Repeat, color: 'bg-indigo-500', types: ['rnn'] },
      { name: 'GRU', icon: Repeat, color: 'bg-teal-500', types: ['rnn'] },
      { name: 'Bidirectional', icon: ArrowLeftRight, color: 'bg-cyan-500', types: ['rnn'] },
    ]
  },
  {
    name: 'Regularization',
    layers: [
      { name: 'L1', icon: Shield, color: 'bg-red-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'L2', icon: Shield, color: 'bg-red-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'L1L2', icon: Shield, color: 'bg-red-500', types: ['cnn', 'rnn', 'feedforward'] },
    ]
  },
  {
    name: 'Normalization',
    layers: [
      { name: 'LayerNormalization', icon: Layers, color: 'bg-indigo-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'GroupNormalization', icon: Layers, color: 'bg-indigo-500', types: ['cnn'] },
    ]
  },
  {
    name: 'Reshaping',
    layers: [
      { name: 'Flatten', icon: Minimize2, color: 'bg-yellow-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'Reshape', icon: Maximize2, color: 'bg-yellow-500', types: ['cnn', 'rnn', 'feedforward'] },
      { name: 'Permute', icon: Shuffle, color: 'bg-yellow-500', types: ['cnn', 'rnn', 'feedforward'] },
    ]
  },
]

const templates = [
  { name: 'Simple CNN', type: 'cnn' },
  { name: 'Basic RNN', type: 'rnn' },
  { name: 'Feedforward NN', type: 'feedforward' },
]

export function LeftSidebar() {
  const [searchTerm, setSearchTerm] = useState('')
  const createModelFromTemplate = useBuilderStore(state => state.createModelFromTemplate)
  const currentModel = useBuilderStore(state => state.currentModel)

  const filteredCategories = layerCategories.map(category => ({
    ...category,
    layers: category.layers.filter(layer => 
      layer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (currentModel ? layer.types.includes(currentModel.type) : true)
    )
  })).filter(category => category.layers.length > 0)

  return (
    <div className="w-64 border-r border-gray-800 p-4 flex flex-col h-full bg-[#1A1A1A] text-white">
      <div className="font-bold text-lg mb-4">NeuralBuilder</div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search layers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border-gray-700 text-white"
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <Accordion type="single" collapsible className="w-full">
        {filteredCategories.map((category, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-b-gray-800">
            <AccordionTrigger className="hover:bg-gray-800">{category.name}</AccordionTrigger>
            <AccordionContent>
              {category.layers.map((layer, layerIndex) => (
                <div
                  key={layerIndex}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md cursor-move"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/reactflow', JSON.stringify({
                      type: layer.name,
                      name: layer.name,
                    }));
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className={`w-6 h-6 rounded-full ${layer.color} flex items-center justify-center`}>
                    <layer.icon className="h-4 w-4 text-white" />
                  </div>
                  <span>{layer.name}</span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              <Box className="h-4 w-4 mr-2" />
              Saved Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Choose a Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {templates.map((template) => (
                <Button
                  key={template.type}
                  onClick={() => {
                    createModelFromTemplate(template.type);
                    // Close the dialog after creating the template
                    (document.querySelector('[data-radix-focus-guard]') as HTMLElement)?.click();
                  }}
                  className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

