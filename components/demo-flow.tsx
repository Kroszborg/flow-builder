"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  type Node,
  type Edge,
  MarkerType,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from "reactflow";
import { CustomNode } from "./custom-node";
import { DecisionNode } from "./decision-node";
import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "Project Start", description: "Initialize your workflow" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 250, y: 0 },
    data: { label: "Planning", description: "Define project scope" },
  },
  {
    id: "3",
    type: "decision",
    position: { x: 125, y: 150 },
    data: { label: "Approval?", description: "Get project approval" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 0, y: 300 },
    data: { label: "Development", description: "Build core features" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 250, y: 300 },
    data: { label: "Revise Plan", description: "Adjust project scope" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
  { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
  { id: "e3-4", source: "3", target: "4", type: "smoothstep", label: "Yes" },
  { id: "e3-5", source: "3", target: "5", type: "smoothstep", label: "No" },
];

export function DemoFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "hsl(var(--primary))" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "hsl(var(--primary))",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          position: {
            x:
              node.position.x +
              Math.sin(Date.now() / 2000 + Number.parseInt(node.id)) * 1,
            y:
              node.position.y +
              Math.cos(Date.now() / 2000 + Number.parseInt(node.id)) * 1,
          },
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [setNodes]);

  return (
    <div className="w-full h-[500px] rounded-lg border bg-background/50 backdrop-blur-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-dot-pattern"
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "hsl(var(--primary))" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--primary))",
          },
        }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
