import mongoose from 'mongoose'

// Node Schema
const NodeSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['input', 'hidden', 'output', 'conv2d', 'maxpool', 'flatten', 'embedding', 'lstm', 'dense', 'layerNode'],
    required: true
  },
  position: {
    x: Number,
    y: Number
  },
  data: {
    label: String,
    type: String,
    config: mongoose.Schema.Types.Mixed
  }
})

// Connection Schema
const ConnectionSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  isValid: Boolean
})

// Edge Schema
const EdgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String
})

// Dataset Schema
const DatasetSchema = new mongoose.Schema({
  name: String,
  size: String,
  uploadedAt: Date,
  filename: String,
  displayName: String
})

// History State Schema
const HistoryStateSchema = new mongoose.Schema({
  nodes: [NodeSchema],
  connections: [ConnectionSchema]
})

// Main Model Schema
const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cnn', 'rnn', 'transformer', 'feedforward'],
    required: true
  },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  connections: [ConnectionSchema],
  history: [HistoryStateSchema],
  historyIndex: {
    type: Number,
    default: -1
  },
  projectName: {
    type: String,
    default: 'Untitled Project'
  },
  lastTrained: Date,
  lastOpened: Date,
  icon: String,
  iconBg: String,
  hasDataset: {
    type: Boolean,
    default: false
  },
  dataset: DatasetSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update timestamps before saving
ModelSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const Model = mongoose.models.Model || mongoose.model('Model', ModelSchema) 