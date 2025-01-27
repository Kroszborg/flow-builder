"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlowEditor } from "@/components/flow-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { type Node, type Edge } from "reactflow";
import { flowStorage } from "@/lib/flow-storage";
import type { FlowData } from "@/types/flow";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

export default function FlowDetail() {
  const params = useParams();
  const router = useRouter();
  const [flow, setFlow] = useState<FlowData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);

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

  const handleSave = useCallback(
    (nodes: Node[], edges: Edge[]) => {
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
        setIsDirty(false);
        toast.success("Flow saved successfully!");
      } else {
        toast.error("Failed to save flow");
      }
    },
    [flow]
  );

  const handleModeChange = useCallback(() => {
    if (isDirty && isEditMode) {
      setShowUnsavedChangesDialog(true);
    } else {
      setIsEditMode(!isEditMode);
    }
  }, [isDirty, isEditMode]);

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
        <Button variant="outline" onClick={handleModeChange}>
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
        onDirtyChange={setIsDirty}
      />
      <ConfirmationDialog
        isOpen={showUnsavedChangesDialog}
        onClose={() => setShowUnsavedChangesDialog(false)}
        onConfirm={() => {
          handleSave(flow.nodes, flow.edges);
          setIsEditMode(false);
          setShowUnsavedChangesDialog(false);
        }}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save them before switching to view mode?"
      />
    </div>
  );
}
