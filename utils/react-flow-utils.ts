import type { Node, Edge, NodeChange, EdgeChange } from "reactflow"

export function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[] {
  return changes.reduce(
    (acc: Node[], change: NodeChange) => {
      if (!('id' in change)) {
        return acc;
      }
      const index = acc.findIndex((node: Node) => node.id === change.id)
      if (index === -1) {
        return acc
      }

      const updatedNode = { ...acc[index], ...change }
      acc[index] = updatedNode
      return acc
    },
    [...nodes],
  )
}

export function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[] {
  return changes.reduce(
    (acc: Edge[], change: EdgeChange) => {
      if (!('id' in change)) {
        return acc;
      }
      const index = acc.findIndex((edge: Edge) => edge.id === change.id)
      if (index === -1) {
        return acc
      }

      const updatedEdge = { ...acc[index], ...change }
      acc[index] = updatedEdge
      return acc
    },
    [...edges],
  )
}

