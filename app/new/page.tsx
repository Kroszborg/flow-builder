"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FlowEditor } from "@/components/flow-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Node, Edge } from "reactflow";
import { flowStorage } from "@/lib/flow-storage";

export default function NewFlow() {
  const [name, setName] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  const handleFlowChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    if (nodes.length === 0) {
      toast.error("Please add at least one node to your flow");
      return;
    }

    try {
      const newFlow = {
        id: crypto.randomUUID(),
        name: name.trim(),
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = flowStorage.saveFlow(newFlow);
      if (saved) {
        toast.success("Flow created successfully!");
        router.push("/flows");
      } else {
        throw new Error("Failed to save flow");
      }
    } catch (error) {
      console.error("Error saving flow:", error);
      toast.error("Failed to create flow");
    }
  }, [name, nodes, edges, router]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/flows">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Flow</h1>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Flow name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-[300px]"
        />
      </div>
      <FlowEditor onSave={handleFlowChange} onDirtyChange={setIsDirty} />
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!name.trim() || !isDirty || nodes.length === 0}
          className="px-6"
        >
          Save Flow
        </Button>
      </div>
    </div>
  );
}
