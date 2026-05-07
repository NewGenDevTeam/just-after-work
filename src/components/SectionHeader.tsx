"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className={align === "center" ? "text-center" : ""}
    >
      <div
        className={`flex items-center gap-3 mb-6 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="w-8 h-px bg-stroke" />
        <span className="text-xs text-muted uppercase tracking-[0.3em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[0.95] tracking-tight mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-muted max-w-xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
