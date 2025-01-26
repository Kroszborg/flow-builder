import type { FlowData } from "@/types/flow"

const STORAGE_KEY = "flows"

export const flowStorage = {
  saveFlow(flow: FlowData): boolean {
    try {
      const flows = this.getFlows()
      const existingFlowIndex = flows.findIndex((f) => f.id === flow.id)

      if (existingFlowIndex !== -1) {
        flows[existingFlowIndex] = {
          ...flows[existingFlowIndex],
          ...flow,
          updatedAt: new Date().toISOString(),
        }
      } else {
        flows.push({
          ...flow,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(flows))
      return true
    } catch (error) {
      console.error("Error saving flow:", error)
      return false
    }
  },

  getFlows(): FlowData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      const flows: FlowData[] = data ? JSON.parse(data) : []
      return flows.map((flow) => ({
        ...flow,
        updatedAt: flow.updatedAt || flow.createdAt,
      }))
    } catch (error) {
      console.error("Error getting flows:", error)
      return []
    }
  },

  getFlow(id: string): FlowData | null {
    try {
      const flows = this.getFlows()
      const flow = flows.find((f) => f.id === id)
      if (flow) {
        return {
          ...flow,
          updatedAt: flow.updatedAt || flow.createdAt,
        }
      }
      return null
    } catch (error) {
      console.error("Error getting flow:", error)
      return null
    }
  },

  deleteFlow(id: string): boolean {
    try {
      const flows = this.getFlows()
      const filteredFlows = flows.filter((f) => f.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFlows))
      return true
    } catch (error) {
      console.error("Error deleting flow:", error)
      return false
    }
  },
}

