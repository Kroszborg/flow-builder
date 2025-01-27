"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  Panel,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import { CustomNode } from "./custom-node";
import { DecisionNode } from "./decision-node";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Plus, ZoomIn, ZoomOut, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import "reactflow/dist/style.css";
import "@reactflow/node-resizer/dist/style.css";
import { useHotkeys } from "react-hotkeys-hook";

const nodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
};

interface FlowEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  flowId?: string;
  isReadOnly?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function FlowEditorContent({
  initialNodes = [],
  initialEdges = [],
  onSave,
  isReadOnly = false,
  onDirtyChange,
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeType, setNodeType] = useState("custom");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, setViewport, zoomIn, zoomOut, fitView } = useReactFlow();

  // Notify parent of changes
  useEffect(() => {
    if (onSave) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  // Mark as dirty when nodes or edges change
  useEffect(() => {
    if (!isReadOnly && onDirtyChange) {
      onDirtyChange(nodes.length > 0 || edges.length > 0);
    }
  }, [nodes.length, edges.length, isReadOnly, onDirtyChange]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
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
      );
    },
    [setEdges]
  );

  const addNode = useCallback(() => {
    if (!nodeName) {
      toast.error("Please enter a node name");
      return;
    }

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: project({ x: Math.random() * 500, y: Math.random() * 300 }),
      data: { label: nodeName, description: nodeDescription },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
    setNodeDescription("");
    toast.success("Node added successfully!");
  }, [nodeName, nodeDescription, nodeType, project, setNodes]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      toast.success("Node deleted successfully!");
    }
  }, [selectedNode, setNodes, setEdges]);

  useHotkeys("delete,backspace", () => {
    if (selectedNode && !isReadOnly) handleDeleteNode();
  });

  return (
    <div className="flex h-[calc(100vh-16rem)] bg-background border rounded-lg overflow-hidden">
      <div className="flex-1 flex flex-col">
        {!isReadOnly && (
          <div className="flex flex-wrap gap-4 p-4 border-b">
            <Input
              placeholder="Node name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="max-w-[200px]"
            />
            <Textarea
              placeholder="Description (optional)"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              className="max-w-[300px] h-10"
            />
            <Select value={nodeType} onValueChange={setNodeType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Default</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addNode} disabled={!nodeName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
          </div>
        )}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={isReadOnly ? undefined : onNodesChange}
            onEdgesChange={isReadOnly ? undefined : onEdgesChange}
            onConnect={isReadOnly ? undefined : onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={isReadOnly ? undefined : handleNodeClick}
            onPaneClick={handlePaneClick}
            fitView
            connectionMode={ConnectionMode.Loose}
            snapToGrid={true}
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "hsl(var(--primary))" },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "hsl(var(--primary))",
              },
            }}
            nodesDraggable={!isReadOnly}
            nodesConnectable={!isReadOnly}
            elementsSelectable={!isReadOnly}
          >
            <Background />
            <Controls />
            <MiniMap />
            <Panel
              position="top-right"
              className="bg-background border rounded-md shadow-md p-2"
            >
              <div className="flex gap-2">
                <Button
                  onClick={() => zoomIn()}
                  variant="outline"
                  size="icon"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => zoomOut()}
                  variant="outline"
                  size="icon"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setViewport({ x: 0, y: 0, zoom: 1 });
                    fitView();
                  }}
                  variant="outline"
                  size="icon"
                  title="Reset View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorContent {...props} />
    </ReactFlowProvider>
  );
}
