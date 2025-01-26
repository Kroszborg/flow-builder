"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlowEditor } from "@/components/flow-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { type Node, type Edge } from "reactflow";
import { flowStorage } from "@/lib/flow-storage";
import type { FlowData } from "@/types/flow";

export default function FlowDetail() {
  const params = useParams();
  const router = useRouter();
  const [flow, setFlow] = useState<FlowData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadFlow = () => {
      const loadedFlow = flowStorage.getFlow(params.id as string);
      if (loadedFlow) {
        setFlow(loadedFlow);
      } else {
        toast.error("Flow not found");
        router.push("/flows");
      }
    };

    loadFlow();
  }, [params.id, router]);

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    if (!flow) return;

    const updatedFlow: FlowData = {
      ...flow,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };

    const saved = flowStorage.saveFlow(updatedFlow);
    if (saved) {
      setFlow(updatedFlow);
    } else {
      toast.error("Failed to save flow");
    }
  };

  if (!flow) return null;

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/flows">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{flow.name}</h1>
        </div>
        <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? (
            <Eye className="w-4 h-4 mr-2" />
          ) : (
            <Edit className="w-4 h-4 mr-2" />
          )}
          {isEditMode ? "View Mode" : "Edit Mode"}
        </Button>
      </div>
      <FlowEditor
        initialNodes={flow.nodes}
        initialEdges={flow.edges}
        onSave={isEditMode ? handleSave : undefined}
        flowId={flow.id}
        isReadOnly={!isEditMode}
      />
    </div>
  );
}
