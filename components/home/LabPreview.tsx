"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { labItems } from "@/lib/lab";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";

const statusLabel: Record<string, string> = {
  shipped: "Shipped",
  beta:    "Beta",
  wip:     "In Progress",
};

export function LabPreview() {
  return (
    <Section id="lab" className="border-t border-[var(--color-border)]">
      <Container>
        <SectionHeader
          label="The Lab"
          title="Experiments & prototypes."
          description="Where I build things to learn things. Interactive, working, and occasionally broken."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {labItems.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/lab/${item.slug}`}
                className="group flex flex-col h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-muted)] transition-all duration-300 hover:-translate-y-1 p-5 gap-4"
              >
                {/* Accent dot + status */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ background: item.accent, border: "1px solid rgba(255,255,255,0.05)" }}
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider uppercase">
                    {statusLabel[item.status]}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {item.tags.map((tag) => (
                    <Tag key={tag} variant="muted">{tag}</Tag>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-end"
        >
          <Link
            href="/lab"
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
          >
            All experiments
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
