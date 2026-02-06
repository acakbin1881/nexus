"use client";

import { motion } from "framer-motion";

const barHeights = [60, 80, 45, 90, 70, 85, 65, 95, 75, 50, 88, 72];

const bids = [
  { price: "43,260.00", size: "0.1234" },
  { price: "43,250.00", size: "0.2456" },
  { price: "43,240.00", size: "0.3678" },
  { price: "43,230.00", size: "0.4891" },
  { price: "43,220.00", size: "0.1567" },
];

const asks = [
  { price: "43,290.00", size: "0.1567" },
  { price: "43,300.00", size: "0.2789" },
  { price: "43,310.00", size: "0.3912" },
  { price: "43,320.00", size: "0.4234" },
  { price: "43,330.00", size: "0.2345" },
];

export default function TradingMockup() {
  return (
    <section className="py-20 px-6 relative overflow-hidden section-container">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-5xl mx-auto"
        style={{ perspective: "2000px" }}
      >
        <div
          className="relative gpu-accelerated"
          style={{
            transform: "rotateX(12deg) rotateY(-5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main trading panel */}
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-[#00F0FF]/20 rounded-lg p-6 md:p-8 shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-lg tracking-wide">
                  BTC/USD
                </span>
                <span className="text-green-400 font-mono text-sm font-semibold">
                  $43,271.50
                </span>
                <span className="text-green-400 text-xs font-mono">
                  +2.34%
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs text-neutral-500 font-mono">
                <span>
                  24h High:{" "}
                  <span className="text-neutral-300">$43,890.00</span>
                </span>
                <span>
                  24h Low:{" "}
                  <span className="text-neutral-300">$42,150.00</span>
                </span>
                <span>
                  24h Vol:{" "}
                  <span className="text-neutral-300">$1.2B</span>
                </span>
              </div>
            </div>

            {/* Chart area */}
            <div className="bg-black/50 rounded-lg h-52 md:h-64 mb-4 relative overflow-hidden border border-[#00F0FF]/10">
              {/* Grid */}
              <div className="absolute inset-0 grid-bg opacity-30" />

              {/* Horizontal reference lines */}
              {[25, 50, 75].map((pos) => (
                <div
                  key={pos}
                  className="absolute left-0 right-0 border-t border-neutral-800/50"
                  style={{ top: `${pos}%` }}
                >
                  <span className="absolute right-2 -top-3 text-[10px] text-neutral-600 font-mono">
                    {(43400 - pos * 3).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Bar chart */}
              <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                {barHeights.map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                    className="w-2 md:w-3 bg-gradient-to-t from-[#00F0FF]/50 to-[#00F0FF] rounded-sm"
                  />
                ))}
              </div>
            </div>

            {/* Order book */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Bids */}
              <div>
                <div className="flex justify-between text-neutral-500 mb-2 px-1">
                  <span>Price (USD)</span>
                  <span>Size (BTC)</span>
                </div>
                <div className="space-y-1">
                  {bids.map((bid, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-green-400 relative px-1 py-0.5"
                    >
                      <div
                        className="absolute inset-0 bg-green-400/5 rounded-sm"
                        style={{ width: `${30 + i * 15}%` }}
                      />
                      <span className="relative z-10">{bid.price}</span>
                      <span className="relative z-10 text-neutral-500">
                        {bid.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asks */}
              <div>
                <div className="flex justify-between text-neutral-500 mb-2 px-1">
                  <span>Price (USD)</span>
                  <span>Size (BTC)</span>
                </div>
                <div className="space-y-1">
                  {asks.map((ask, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-red-400 relative px-1 py-0.5"
                    >
                      <div
                        className="absolute inset-0 bg-red-400/5 rounded-sm right-0 left-auto"
                        style={{ width: `${25 + i * 12}%` }}
                      />
                      <span className="relative z-10">{ask.price}</span>
                      <span className="relative z-10 text-neutral-500">
                        {ask.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reflection glow */}
          <div className="absolute -bottom-8 left-1/4 right-1/4 h-8 bg-[#00F0FF]/10 blur-2xl rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
