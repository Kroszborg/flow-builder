"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, GitBranch, Users, Workflow, Database } from "lucide-react";

const useCases = [
  {
    title: "Project Management",
    description:
      "Visualize project stages, dependencies, and milestones to keep your team aligned.",
    icon: <Workflow className="w-10 h-10" />,
  },
  {
    title: "User Journey Mapping",
    description:
      "Map out user flows and interactions to improve your product's user experience.",
    icon: <Users className="w-10 h-10" />,
  },
  {
    title: "Software Architecture",
    description:
      "Design and document your system's components and their relationships.",
    icon: <Database className="w-10 h-10" />,
  },
  {
    title: "Git Workflow",
    description:
      "Illustrate your Git branching strategy and release processes.",
    icon: <GitBranch className="w-10 h-10" />,
  },
];

export function UseCases() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {useCases.map((useCase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="text-primary">{useCase.icon}</div>
                {useCase.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {useCase.description}
              </p>
              <motion.div
                className="flex items-center text-primary font-semibold"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="mr-2">Learn more</span>
                <ArrowRight size={16} />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
