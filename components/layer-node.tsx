'use client'

import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { FileInputIcon as Input, Cpu, Box, Repeat, BarChart3, ArrowRightLeft } from 'lucide-react'

const layerIcons = {
  Input: Input,
  Output: BarChart3,
  Dense: Box,
  Activation: ArrowRightLeft,
  Conv2D: Cpu,
  MaxPooling2D: Repeat,
  LSTM: Repeat,
  GRU: Repeat,
  Conv1D: Cpu,
  Conv3D: Cpu,
  MaxPooling1D: Repeat,
  MaxPooling3D: Repeat,
  AveragePooling1D: Repeat,
  AveragePooling2D: Repeat,
  AveragePooling3D: Repeat,
  SimpleRNN: Repeat,
  Bidirectional: ArrowRightLeft,
  Dropout: Box,
  BatchNormalization: Box,
  L1: Box,
  L2: Box,
  L1L2: Box,
  LayerNormalization: Box,
  GroupNormalization: Box,
  Flatten: Box,
  Reshape: Box,
  Permute: Box,
}

const layerColors = {
  Input: 'bg-blue-500',
  Output: 'bg-green-500',
  Dense: 'bg-purple-500',
  Activation: 'bg-yellow-500',
  Conv1D: 'bg-orange-500',
  Conv2D: 'bg-orange-600',
  Conv3D: 'bg-orange-700',
  MaxPooling1D: 'bg-pink-500',
  MaxPooling2D: 'bg-pink-600',
  MaxPooling3D: 'bg-pink-700',
  AveragePooling1D: 'bg-red-500',
  AveragePooling2D: 'bg-red-600',
  AveragePooling3D: 'bg-red-700',
  SimpleRNN: 'bg-indigo-500',
  LSTM: 'bg-indigo-600',
  GRU: 'bg-teal-500',
  Bidirectional: 'bg-cyan-500',
  Dropout: 'bg-red-500',
  BatchNormalization: 'bg-indigo-500',
  L1: 'bg-purple-500',
  L2: 'bg-purple-600',
  L1L2: 'bg-purple-700',
  LayerNormalization: 'bg-indigo-600',
  GroupNormalization: 'bg-indigo-700',
  Flatten: 'bg-yellow-600',
  Reshape: 'bg-yellow-700',
  Permute: 'bg-yellow-800',
  // Add colors for potentially missing layer types
  Embedding: 'bg-blue-600',
  TimeDistributed: 'bg-green-600',
  SpatialDropout1D: 'bg-red-600',
  SpatialDropout2D: 'bg-red-700',
  SpatialDropout3D: 'bg-red-800',
}

export const LayerNode = memo(({ data, isConnectable }: any) => {
  const IconComponent = layerIcons[data.type] || Box
  const bgColor = layerColors[data.type as keyof typeof layerColors] || 'bg-gray-500'

  return (
    <div className={`px-4 py-2 shadow-md rounded-md ${bgColor} text-white`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="flex items-center">
        <IconComponent className="mr-2 h-5 w-5" />
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  )
})

LayerNode.displayName = 'LayerNode'

