"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/work",  label: "Work"  },
  { href: "/lab",   label: "Lab"   },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
        >
          mp<span className="text-[var(--color-accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "text-[var(--color-fg)] bg-[var(--color-surface)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:hi@mikeperezdigital.com"
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            hi@mikeperezdigital.com
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={cn("block w-5 h-px bg-current transition-all duration-200", menuOpen && "translate-y-2 rotate-45")} />
          <span className={cn("block w-5 h-px bg-current transition-all duration-200", menuOpen && "opacity-0")} />
          <span className={cn("block w-5 h-px bg-current transition-all duration-200", menuOpen && "-translate-y-2 -rotate-45")} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-b border-[var(--color-border)] bg-[var(--color-bg)]",
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "text-[var(--color-fg)] bg-[var(--color-surface)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="mailto:hi@mikeperezdigital.com"
            className="px-3 py-2.5 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            hi@mikeperezdigital.com
          </a>
        </nav>
      </div>
    </header>
  );
}
