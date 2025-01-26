import type { Node, Edge } from "reactflow"

export interface FlowData {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string // Change this to be required
}

// Remove the separate Flow interface if it's not needed elsewhere

