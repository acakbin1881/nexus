"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";

export default function Stats() {
  return (
    <section className="py-20 border-y border-neutral-800 relative overflow-hidden section-container">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0, 240, 255, 0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#00F0FF] neon-glow mb-3">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-500 font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
