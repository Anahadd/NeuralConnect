import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow'
import * as api from './api'
import { HistoryState } from './api'

export interface Node {
  id: string
  type: 'input' | 'hidden' | 'output' | 'conv2d' | 'maxpool' | 'flatten' | 'embedding' | 'lstm' | 'dense'
  position: { x: number; y: number }
  data: {
    label: string
    config: Record<string, any>
  }
}

export interface Connection {
  id: string
  source: string
  target: string
  isValid: boolean
}

type Edge = {
  id: string
  source: string
  target: string
}

interface ModelData {
  _id: string
  name: string
  type: string
  nodes: Node[]
  edges: Edge[]
  connections: Connection[]
  history: HistoryState[]
  historyIndex: number
  projectName: string
  lastTrained?: string
  lastOpened?: string
  icon?: string
  iconBg?: string
  hasDataset?: boolean
  dataset?: {
    name: string
    size: string
    uploadedAt: string
    filename: string
  }
  createdAt: string
  updatedAt: string
}

interface BuilderStore {
  nodes: Node[]
  connections: Connection[]
  selectedNode: string | null
  isDragging: boolean
  isConnecting: boolean
  connectionStart: string | null
  history: Array<{ nodes: Node[]; connections: Connection[] }>
  historyIndex: number
  models: ModelData[] 
  edges: Edge[]
  projectName: string;
  currentModel: ModelData | null;
  
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, data: Partial<Node>) => void
  setNodes: (nodes: Node[]) => void
  saveNodes: (modelId: string) => Promise<void>
  addConnection: (source: string, target: string) => void
  removeConnection: (id: string) => void
  setSelectedNode: (id: string | null) => void
  setIsDragging: (isDragging: boolean) => void
  setIsConnecting: (isConnecting: boolean) => void
  setConnectionStart: (nodeId: string | null) => void
  undo: () => void
  redo: () => void
  setModelDataset: (modelId: string, dataset: { name: string; size: string }) => void
  addEdge: (edge: Edge) => void
  removeEdge: (id: string) => void
  createModelFromTemplate: (templateType: string) => void
  updateProjectName: (name: string) => void;
  updateCurrentModel: (model: ModelData) => void;
  createModel: (name: string, type: string) => Promise<void>
  loadModelNodes: (modelId: string) => Promise<void>
  uploadDataset: (file: File, modelId: string) => Promise<void>
  saveNodesToDatabase: (modelId: string) => Promise<void>
}

export const useBuilderStore = create<BuilderStore>()(
  subscribeWithSelector((set, get) => ({
    nodes: [],
    connections: [],
    selectedNode: null,
    isDragging: false,
    isConnecting: false,
    connectionStart: null,
    history: [],
    historyIndex: -1,
    models: [], 
    edges: [],
    projectName: 'Untitled Project',
    currentModel: null,

    addNode: (node) => {
      set((state) => ({
        nodes: [...state.nodes, node]
      }))
      console.log('Node added to local array:', node)
    },

    removeNode: (nodeId) => {
      set((state) => ({
        nodes: state.nodes.filter(node => node.id !== nodeId)
      }))
      console.log('Node removed from local array:', nodeId)
    },

    updateNode: (nodeId, data) => {
      set((state) => ({
        nodes: state.nodes.map(node => 
          node.id === nodeId ? { ...node, ...data } : node
        )
      }))
      console.log('Node updated in store:', nodeId, data)
    },

    setNodes: (nodes) => {
      set({ nodes })
      console.log('Nodes set in store:', nodes)
    },

    saveNodes: async (modelId) => {
      const nodes = get().nodes
      console.log('Attempting to save nodes to Python backend:', nodes)

      try {
        const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nodes }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save nodes')
        }

        const result = await response.json()
        console.log('Save response from Python backend:', result)
        return result
      } catch (error) {
        console.error('Error saving nodes to Python backend:', error)
        throw error
      }
    },

    addConnection: (source, target) => {
      const connection: Connection = {
        id: nanoid(),
        source,
        target,
        isValid: true 
      }
      
      set(state => ({
        connections: [...state.connections, connection]
      }))
    },

    removeConnection: (id) => {
      set(state => ({
        connections: state.connections.filter(conn => conn.id !== id)
      }))
    },

    setSelectedNode: (id) => set({ selectedNode: id }),
    setIsDragging: (isDragging) => set({ isDragging }),
    setIsConnecting: (isConnecting) => set({ isConnecting }),
    setConnectionStart: (nodeId) => set({ connectionStart: nodeId }),

    undo: () => {
      const { historyIndex, history } = get()
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1]
        set({
          nodes: previousState.nodes,
          connections: previousState.connections,
          historyIndex: historyIndex - 1
        })
      }
    },

    redo: () => {
      const { historyIndex, history } = get()
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1]
        set({
          nodes: nextState.nodes,
          connections: nextState.connections,
          historyIndex: historyIndex + 1
        })
      }
    },
    setModelDataset: (modelId: string, dataset: { name: string; size: string }) => 
      set((state: BuilderStore) => ({
        models: state.models.map(model =>
          model._id === modelId
            ? { ...model, hasDataset: true, dataset: { 
                ...dataset,
                uploadedAt: new Date().toISOString(),
                filename: dataset.name
              }}
            : model
        )
      })),
    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
    removeEdge: (id) => set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id) })),
    createModelFromTemplate: (templateType: string) => {
      let newNodes: Node[] = []
      let newEdges: Edge[] = []

      const createNode = (id: string, type: Node['type'], label: string, x: number, y: number): Node => ({
        id,
        type,
        position: { x, y },
        data: { 
          label,
          config: {}
        }
      })

      const createEdge = (source: string, target: string): Edge => ({
        id: `e${source}-${target}`,
        source,
        target
      })

      switch (templateType) {
        case 'cnn':
          newNodes = [
            createNode('input', 'input', 'Input', 100, 100),
            createNode('conv1', 'conv2d', 'Conv2D', 250, 100),
            createNode('pool1', 'maxpool', 'MaxPooling2D', 400, 100),
            createNode('flatten', 'flatten', 'Flatten', 550, 100),
            createNode('dense', 'dense', 'Dense', 700, 100),
            createNode('output', 'output', 'Output', 850, 100),
          ]
          newEdges = [
            createEdge('input', 'conv1'),
            createEdge('conv1', 'pool1'),
            createEdge('pool1', 'flatten'),
            createEdge('flatten', 'dense'),
            createEdge('dense', 'output'),
          ]
          break
        case 'rnn':
          newNodes = [
            createNode('input', 'input', 'Input', 100, 100),
            createNode('embedding', 'embedding', 'Embedding', 250, 100),
            createNode('lstm', 'lstm', 'LSTM', 400, 100),
            createNode('dense', 'dense', 'Dense', 550, 100),
            createNode('output', 'output', 'Output', 700, 100),
          ]
          newEdges = [
            createEdge('input', 'embedding'),
            createEdge('embedding', 'lstm'),
            createEdge('lstm', 'dense'),
            createEdge('dense', 'output'),
          ]
          break
        case 'feedforward':
          newNodes = [
            createNode('input', 'input', 'Input', 100, 100),
            createNode('dense1', 'dense', 'Dense', 250, 100),
            createNode('dense2', 'dense', 'Dense', 400, 100),
            createNode('output', 'output', 'Output', 550, 100),
          ]
          newEdges = [
            createEdge('input', 'dense1'),
            createEdge('dense1', 'dense2'),
            createEdge('dense2', 'output'),
          ]
          break
      }

      set((state) => ({
        nodes: newNodes,
        edges: newEdges,
        history: [...state.history, { nodes: newNodes, connections: state.connections }],
        historyIndex: state.historyIndex + 1,
      }))
    },
    updateProjectName: (name: string) => set({ projectName: name }),
    updateCurrentModel: (model: ModelData) => set({ currentModel: model }),
    createModel: async (name, type) => {
      try {
        const model = await api.saveModel({ name, type })
        set({ currentModel: model })
      } catch (error) {
        console.error('Failed to create model:', error)
        throw error
      }
    },
    loadModelNodes: async (modelId) => {
      try {
        const nodes = await api.getModelNodes(modelId)
        return nodes
      } catch (error) {
        console.error('Failed to load model nodes:', error)
        throw error
      }
    },
    uploadDataset: async (file, modelId) => {
      try {
        const result = await api.uploadDataset(file, modelId)
        const currentModel = get().currentModel
        if (currentModel && currentModel._id === modelId) {
          set({ 
            currentModel: { 
              ...currentModel, 
              hasDataset: true, 
              dataset: result.dataset 
            } 
          })
        }
      } catch (error) {
        console.error('Failed to upload dataset:', error)
        throw error
      }
    },
    saveNodesToDatabase: async (modelId: string) => {
      const nodes = get().nodes
      console.log('Saving nodes array to database:', nodes)

      try {
        const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nodes: nodes })
        })

        if (!response.ok) {
          throw new Error('Failed to save nodes to database')
        }

        const result = await response.json()
        console.log('Nodes saved successfully:', result)
        return result
      } catch (error) {
        console.error('Error saving nodes:', error)
        throw error
      }
    }
  }))
)

