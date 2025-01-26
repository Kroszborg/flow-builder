"use client";

import { motion } from "framer-motion";
import { Share2, Download, Pencil, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Pencil className="w-10 h-10" />,
    title: "Interactive Editing",
    description:
      "Create and edit flows with an intuitive drag-and-drop interface and real-time preview",
  },
  {
    icon: <Share2 className="w-10 h-10" />,
    title: "Easy Export",
    description: "Download your flows as JSON files and share them with others",
  },
  {
    icon: <Search className="w-10 h-10" />,
    title: "Quick Search",
    description:
      "Find your flows instantly with the built-in search functionality",
  },
  {
    icon: <Download className="w-10 h-10" />,
    title: "Local Storage",
    description:
      "Your flows are automatically saved in your browser for easy access",
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6 flex flex-col h-full">
              <motion.div
                className="mb-4 text-primary"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground flex-grow">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
