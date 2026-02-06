"use client";

import { footerLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold tracking-wider text-white mb-4 bg-gradient-to-r from-[#00F0FF] to-[#0066FF] bg-clip-text text-transparent">
              NEXUS
            </div>
            <p className="text-sm text-neutral-500 tracking-wide leading-relaxed">
              The future of decentralized trading
            </p>
          </div>

          {/* Link sections */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 hover:text-[#00F0FF] transition-colors tracking-wide"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p className="tracking-wide">&copy; 2024 Nexus. All rights reserved.</p>
          <nav
            className="flex gap-6 mt-4 md:mt-0"
            aria-label="Social links"
          >
            <a
              href="#"
              className="hover:text-[#00F0FF] transition-colors tracking-wide"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-[#00F0FF] transition-colors tracking-wide"
              aria-label="Discord"
            >
              Discord
            </a>
            <a
              href="#"
              className="hover:text-[#00F0FF] transition-colors tracking-wide"
              aria-label="GitHub"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
