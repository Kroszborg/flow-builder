import { FlowList } from "@/components/flow-list";

export default function FlowsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Flows</h1>
      </div>
      <FlowList />
    </div>
  );
}
