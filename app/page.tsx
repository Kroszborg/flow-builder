import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, List, ArrowRight } from "lucide-react";
import { DemoFlow } from "@/components/demo-flow";
import { Features } from "@/components/features";
import { GradientBlob } from "@/components/gradient-blob";
import { UseCases } from "@/components/use-cases";

export default function Home() {
  return (
    <div className="relative">
      <GradientBlob />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Flow Builder
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, visualize, and manage workflows with ease. Perfect for
              project planning, user journeys, and process mapping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/flows/new">
                <Button size="lg" className="w-full sm:w-auto group">
                  <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                  Create New Flow
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              </Link>
              <Link href="/flows">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto group"
                >
                  <List className="w-5 h-5 mr-2" />
                  View Your Flows
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto mb-24">
            <DemoFlow />
          </div>
        </div>

        <div className="w-full mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features for Your Workflow
          </h2>
          <Features />
        </div>

        <div className="w-full mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Explore Use Cases
          </h2>
          <UseCases />
        </div>

        <div className="w-full text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating amazing flows with
            our tool.
          </p>
          <Link href="/flows/new">
            <Button size="lg" className="group">
              Start Building Your Flow
              <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
