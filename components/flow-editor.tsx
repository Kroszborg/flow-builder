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
import {
  Plus,
  Save,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import "reactflow/dist/style.css";
// import { NodeResizer } from "@reactflow/node-resizer"
import "@reactflow/node-resizer/dist/style.css";
import { useHotkeys } from "react-hotkeys-hook";
// import { useDebounce } from "@/hooks/use-debounce"

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
}

function FlowEditorContent({
  initialNodes = [],
  initialEdges = [],
  onSave,
  flowId,
  isReadOnly = false,
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeType, setNodeType] = useState("custom");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, getNodes, getEdges, setViewport, zoomIn, zoomOut, fitView } =
    useReactFlow();

  // const debouncedNodes = useDebounce(nodes, 1000)
  // const debouncedEdges = useDebounce(edges, 1000)

  useEffect(() => {
    if (initialNodes.length > 0 || initialEdges.length > 0) {
      fitView();
    }
  }, [initialNodes, initialEdges, fitView]);

  useEffect(() => {
    let saveTimeout: NodeJS.Timeout;

    const saveFlow = () => {
      if (onSave) {
        const currentNodes = getNodes();
        const currentEdges = getEdges();
        onSave(currentNodes, currentEdges);
      }
    };

    const debouncedSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveFlow, 1000); // Debounce for 1 second
    };

    // Call debouncedSave whenever nodes or edges change
    debouncedSave();

    // Also set up an autosave timer
    const autosaveTimer = setInterval(saveFlow, 30000); // Autosave every 30 seconds

    return () => {
      clearTimeout(saveTimeout);
      clearInterval(autosaveTimer);
    };
  }, [nodes, edges, onSave, getNodes, getEdges]);

  useEffect(() => {
    if (onSave) {
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      onSave(currentNodes, currentEdges);
    }
  }, [onSave, getNodes, getEdges]); // Removed unnecessary dependencies: nodes, edges

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

  const handleSave = useCallback(() => {
    if (onSave && !isReadOnly) {
      const currentNodes = getNodes();
      const currentEdges = getEdges();
      onSave(currentNodes, currentEdges);
      toast.success("Flow saved successfully!");
    }
  }, [getNodes, getEdges, onSave, isReadOnly]);

  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => {
      const columns = Math.ceil(Math.sqrt(nodes.length));
      const row = Math.floor(index / columns);
      const col = index % columns;
      return {
        ...node,
        position: {
          x: col * 250,
          y: row * 150,
        },
      };
    });
    setNodes(layoutedNodes);
    setViewport({ x: 0, y: 0, zoom: 1 });
    toast.success("Auto-layout applied successfully!");
  }, [nodes, setNodes, setViewport]);

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

  const handleExport = useCallback(() => {
    const flow = {
      id: flowId,
      nodes: getNodes(),
      edges: getEdges(),
    };
    const jsonString = JSON.stringify(flow, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flow-${flowId || "export"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Flow exported successfully!");
  }, [getNodes, getEdges, flowId]);

  useHotkeys(
    "ctrl+s, cmd+s",
    (event) => {
      event.preventDefault();
      handleSave();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "delete, backspace",
    () => {
      if (selectedNode) handleDeleteNode();
    },
    { enableOnFormTags: true }
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background border rounded-lg overflow-hidden">
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
            <Button onClick={handleSave} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Flow
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
            {!isReadOnly && (
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
                    onClick={handleAutoLayout}
                    variant="outline"
                    size="icon"
                    title="Auto Layout"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="icon"
                    title="Export Flow"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Panel>
            )}
          </ReactFlow>
          {selectedNode && !isReadOnly && (
            <div className="absolute bottom-4 left-4 p-4 bg-background border rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Selected Node</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteNode}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedNode.data.label}
                {selectedNode.data.description && (
                  <span className="block mt-1">
                    {selectedNode.data.description}
                  </span>
                )}
              </p>
            </div>
          )}
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
