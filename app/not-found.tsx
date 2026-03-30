"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f0e0c] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      
      {/* Background visual detail */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(200,96,26,0.05)_0%,transparent_70%)]" />
        {/* Subtle scan line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-8">Error 404</p>
          
          <h1 className="text-8xl md:text-9xl font-semibold text-white tracking-tighter mb-8 italic">
            Lost in<br />Space.
          </h1>

          <p className="text-base text-[var(--color-muted)] leading-relaxed mb-12 max-w-sm mx-auto">
            The page you are looking for has either been moved to the future or was never prototyped in this timeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-all w-full sm:w-auto"
            >
              Return Home
            </Link>
            <Link
              href="/work"
              className="px-8 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all w-full sm:w-auto"
            >
              View Work
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Terminal footer detail */}
      <div className="fixed bottom-8 left-0 right-0 text-center px-6 pointer-events-none">
        <p className="font-mono text-[9px] text-white/10 uppercase tracking-widest">
          $ locate &quot;requested_path&quot; · Status: FAILED · (0) matches found
        </p>
      </div>
    </main>
  );
}
