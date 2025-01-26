"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Download, Trash, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import type { Node, Edge } from "reactflow";
import Link from "next/link";
import { Input } from "./ui/input";
import { flowStorage } from "@/lib/flow-storage";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "./confirmation-dialog";

interface Flow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt?: string;
}

export function FlowList() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteFlowId, setDeleteFlowId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadFlows = () => {
      const storedFlows = flowStorage.getFlows();
      setFlows(storedFlows);
    };

    loadFlows();
    // Reload flows every 5 seconds to keep the list updated
    const interval = setInterval(loadFlows, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = (flow: Flow) => {
    try {
      const jsonString = JSON.stringify(flow, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${flow.name.toLowerCase().replace(/\s+/g, "-")}-flow.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Flow downloaded successfully");
    } catch (error) {
      console.error("Error downloading flow:", error);
      toast.error("Failed to download flow");
    }
  };

  const handleDelete = (id: string) => {
    try {
      flowStorage.deleteFlow(id);
      setFlows(flows.filter((flow) => flow.id !== id));
      toast.success("Flow deleted successfully");
    } catch (error) {
      console.error("Error deleting flow:", error);
      toast.error("Failed to delete flow");
    }
    setDeleteFlowId(null);
  };

  const filteredFlows = flows.filter((flow) =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (flows.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No flows created yet.</p>
        <Link href="/flows/new">
          <Button>Create your first flow</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search flows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlows.map((flow) => (
          <Card key={flow.id}>
            <CardHeader>
              <CardTitle>{flow.name}</CardTitle>
              <CardDescription>
                Created: {new Date(flow.createdAt).toLocaleDateString()}
                {flow.updatedAt && (
                  <>
                    <br />
                    Updated: {new Date(flow.updatedAt).toLocaleDateString()}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/flows/${flow.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/flows/${flow.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(flow)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteFlowId(flow.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmationDialog
        isOpen={!!deleteFlowId}
        onClose={() => setDeleteFlowId(null)}
        onConfirm={() => deleteFlowId && handleDelete(deleteFlowId)}
        title="Delete Flow"
        description="Are you sure you want to delete this flow? This action cannot be undone."
      />
    </div>
  );
}
