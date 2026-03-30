"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { workItems } from "@/lib/work";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";

export function WorkGrid() {
  return (
    <Section id="work">
      <Container>
        <SectionHeader
          label="Selected Work"
          title="Enterprise depth, AI edge."
          description="10+ years of design across Apple, fintech, and AI. Every case study has a working prototype — not screenshots, not Figma links."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workItems.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/work/${item.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-muted)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Visual area */}
                <div
                  className="w-full aspect-[16/9] relative overflow-hidden"
                  style={{ background: item.accent }}
                >
                  {/* Placeholder grid pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  {/* Company label in corner */}
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
                      {item.company}
                    </span>
                  </div>
                  {/* NDA badge */}
                  {item.status === "nda" && (
                    <div className="absolute top-4 right-4">
                      <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/30 tracking-widest uppercase">
                        NDA
                      </span>
                    </div>
                  )}
                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-medium text-[var(--color-fg)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-muted)] shrink-0 mt-0.5">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {item.tags.map((tag) => (
                      <Tag key={tag} variant="default">{tag}</Tag>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <Link
            href="/work"
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
          >
            All case studies
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
