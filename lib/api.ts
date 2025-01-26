const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"

export interface Node {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
}

export interface Edge {
  id: string
  source: string
  target: string
  type?: string
  data?: Record<string, any>
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
  type: string
}

export interface HistoryState {
  nodes: Node[]
  edges: Edge[]
  connections: Connection[]
  timestamp: string
}

export interface ModelData {
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

// Model CRUD operations
export async function fetchModels(): Promise<ModelData[]> {
  const response = await fetch(`${API_BASE_URL}/models`)
  if (!response.ok) throw new Error("Failed to fetch models")
  return response.json()
}

export async function saveModel(model: Partial<ModelData>) {
  const response = await fetch(`${API_BASE_URL}/models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to save model")
  return response.json()
}

export async function updateModel(id: string, model: Partial<ModelData>) {
  const response = await fetch(`${API_BASE_URL}/models/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to update model")
  return response.json()
}

export async function deleteModel(id: string) {
  const response = await fetch(`${API_BASE_URL}/models/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete model")
  return response.json()
}

// Nodes operations
export async function getModelNodes(id: string) {
  const response = await fetch(`${API_BASE_URL}/models/${id}/nodes`)
  if (!response.ok) throw new Error("Failed to fetch nodes")
  return response.json()
}

export async function updateModelNodes(id: string, nodes: Node[]) {
  const response = await fetch(`${API_BASE_URL}/models/${id}/nodes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nodes),
  })
  if (!response.ok) throw new Error("Failed to update nodes")
  return response.json()
}

// Edges operations
export async function getModelEdges(id: string) {
  const response = await fetch(`${API_BASE_URL}/models/${id}/edges`)
  if (!response.ok) throw new Error("Failed to fetch edges")
  return response.json()
}

export async function updateModelEdges(id: string, edges: Edge[]) {
  const response = await fetch(`${API_BASE_URL}/models/${id}/edges`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(edges),
  })
  if (!response.ok) throw new Error("Failed to update edges")
  return response.json()
}

// Dataset operations
export async function uploadDataset(file: File, modelId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('modelId', modelId)

  const response = await fetch(`${API_BASE_URL}/models/${modelId}/dataset`, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) throw new Error("Failed to upload dataset")
  return response.json()
}

// Code generation
export async function generateCode(modelId: string) {
  const response = await fetch(`${API_BASE_URL}/models/${modelId}/generate`, {
    method: "POST",
  })
  if (!response.ok) throw new Error("Failed to generate code")
  return response.json()
}

// AI operations
export async function generateNetworkCode(layers: any[], edges: any[], networkType: string) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ layers, edges, network_type: networkType }),
  })
  if (!response.ok) {
    throw new Error("Failed to generate network code")
  }
  return response.json()
}

export async function validateNetwork(layers: any[], edges: any[]) {
  const response = await fetch(`${API_BASE_URL}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ layers, edges }),
  })
  if (!response.ok) {
    throw new Error("Failed to validate network")
  }
  return response.json()
}

export async function explainConcepts(prompt: string, blocks: any[]) {
  const response = await fetch(`${API_BASE_URL}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, blocks }),
  })
  if (!response.ok) {
    throw new Error("Failed to explain concepts")
  }
  return response.json()
}

