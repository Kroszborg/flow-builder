"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlowEditor } from "@/components/flow-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Node, Edge } from "reactflow";

export default function NewFlow() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    if (!name) {
      toast.error("Please enter a flow name");
      return;
    }

    const newFlow = {
      id: crypto.randomUUID(),
      name,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const storedFlows = localStorage.getItem("flows");
    const flows = storedFlows ? JSON.parse(storedFlows) : [];
    flows.push(newFlow);
    localStorage.setItem("flows", JSON.stringify(flows));
    toast.success("Flow created successfully!");
    router.push("/flows");
  };

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
      <FlowEditor onSave={handleSave} />
    </div>
  );
}
