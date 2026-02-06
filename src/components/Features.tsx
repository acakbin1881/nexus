"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/data";

function FeatureIcon({ icon }: { icon: string }) {
  const paths: Record<string, React.ReactNode> = {
    bolt: (
      <path
        d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"
        stroke="#00F0FF"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    layers: (
      <>
        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12l10 5 10-5"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    shield: (
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#00F0FF"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    trending: (
      <>
        <polyline
          points="23 6 13.5 15.5 8.5 10.5 1 18"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="17 6 23 6 23 12"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    chart: (
      <>
        <line
          x1="18"
          y1="20"
          x2="18"
          y2="10"
          stroke="#00F0FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="20"
          x2="12"
          y2="4"
          stroke="#00F0FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="20"
          x2="6"
          y2="14"
          stroke="#00F0FF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    clock: (
      <>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
        />
        <polyline
          points="12 6 12 12 16 14"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden="true"
    >
      {paths[icon]}
    </svg>
  );
}

export default function Features() {
  return (
    <section className="py-24 md:py-32 px-6 relative section-container">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Built for{" "}
            <span className="text-[#00F0FF] neon-glow">Performance</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto tracking-wide">
            Institutional-grade infrastructure designed for professional traders
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{
                y: -5,
                borderColor: "rgba(0, 240, 255, 0.5)",
              }}
              className="group relative bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-lg p-8 hover-glow cursor-pointer transition-all duration-300"
            >
              {/* Icon container */}
              <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-6 group-hover:bg-[#00F0FF]/20 transition-colors">
                <FeatureIcon icon={feature.icon} />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-neutral-400 leading-relaxed tracking-wide text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
