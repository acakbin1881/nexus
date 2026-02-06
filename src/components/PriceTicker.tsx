"use client";

import { tickerData } from "@/lib/data";

export default function PriceTicker() {
  const items = [...tickerData, ...tickerData];

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-neutral-900/50 border-b border-neutral-800 h-12 flex items-center overflow-hidden">
      <div className="animate-marquee flex gap-16 whitespace-nowrap gpu-accelerated">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">
              {item.pair}
            </span>
            <span className="text-white font-mono text-sm font-semibold">
              {item.price}
            </span>
            <span
              className={`text-xs font-mono ${
                item.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
