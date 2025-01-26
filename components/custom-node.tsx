"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps, NodeResizer } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CustomNode({ data, isConnectable, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [description, setDescription] = useState(data.description);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
    data.description = description;
  }, [data, label, description]);

  return (
    <div className="relative">
      <NodeResizer isVisible={selected} minWidth={200} minHeight={100} />
      <Card
        className={`min-w-[200px] ${selected ? "ring-2 ring-primary" : ""}`}
      >
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleBlur}
                autoFocus
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleBlur}
                placeholder="Description"
                rows={2}
              />
            </div>
          ) : (
            <div onDoubleClick={handleDoubleClick}>
              <div className="text-sm font-medium">{label}</div>
              {description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {description}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary hover:!bg-primary/80 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary hover:!bg-primary/80 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary hover:!bg-primary/80 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary hover:!bg-primary/80 transition-colors"
      />
    </div>
  );
}
