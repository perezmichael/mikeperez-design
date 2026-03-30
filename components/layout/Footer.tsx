import Link from "next/link";
import { Container } from "./Container";

const links = {
  nav: [
    { href: "/work",  label: "Work"  },
    { href: "/lab",   label: "Lab"   },
    { href: "/about", label: "About" },
  ],
  social: [
    { href: "https://linkedin.com/in/mikeperezdigital", label: "LinkedIn" },
    { href: "https://instagram.com/frequentflyer",      label: "Instagram" },
    { href: "mailto:hi@mikeperezdigital.com",           label: "Email" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] py-12 mt-auto">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Logo + tagline */}
          <div>
            <Link
              href="/"
              className="font-mono text-sm text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
            >
              mp<span className="text-[var(--color-accent)]">.</span>
            </Link>
            <p className="mt-1 text-xs text-[var(--color-muted)] font-mono">
              Designer. Builder. Currently at Apple.
            </p>
          </div>

          {/* Nav + social */}
          <div className="flex gap-8">
            <nav className="flex flex-col gap-2">
              {links.nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-col gap-2">
              {links.social.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-xs text-[var(--color-muted)]">
            © {year} Mike Perez. Built with Claude Code.
          </p>
          <p className="font-mono text-xs text-[var(--color-muted)]">
            Los Angeles, CA
          </p>
        </div>
      </Container>
    </footer>
  );
}
