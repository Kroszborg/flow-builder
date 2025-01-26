import { FlowList } from "@/components/flow-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function FlowsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Flows</h1>
        <Link href="/flows/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Flow
          </Button>
        </Link>
      </div>
      <FlowList />
    </div>
  )
}

