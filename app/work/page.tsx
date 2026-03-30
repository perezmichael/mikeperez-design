import Link from "next/link";
import { workItems } from "@/lib/work";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";

export const metadata = {
  title: "Work — Mike Perez",
  description: "Case studies from Apple, Titan, and Frequent Flyer.",
};

export default function WorkPage() {
  return (
    <Section>
      <Container>
        <SectionHeader
          label="Selected Work"
          title="Enterprise depth, AI edge."
          description="10+ years of design across Apple, fintech, and AI. Every case study has a working prototype — not screenshots, not Figma links."
        />

        <div className="grid grid-cols-1 gap-4">
          {workItems.map((item, i) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="group grid grid-cols-1 md:grid-cols-[280px_1fr] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-muted)] transition-all duration-300"
            >
              {/* Visual */}
              <div
                className="h-[160px] md:h-auto relative overflow-hidden"
                style={{ background: item.accent }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
                    {item.company}
                  </span>
                </div>
                {item.status === "nda" && (
                  <div className="absolute bottom-4 left-4">
                    <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/30 tracking-widest uppercase">
                      NDA · Recreated
                    </span>
                  </div>
                )}
                {/* Index number */}
                <div className="absolute bottom-4 right-4 font-mono text-4xl font-bold text-white/5 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                      {item.title}
                    </h2>
                    <span className="font-mono text-xs text-[var(--color-muted)] shrink-0">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Tag key={tag} variant="default">{tag}</Tag>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 shrink-0">
                    View
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
