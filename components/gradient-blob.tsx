"use client";

import { motion } from "framer-motion";

export function GradientBlob() {
  return (
    <motion.div
      className="fixed inset-0 z-[-1] opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
