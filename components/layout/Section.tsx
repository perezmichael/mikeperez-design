import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-24 lg:py-32", className)}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 lg:mb-16", className)}>
      {label && (
        <p className="font-mono text-xs text-[var(--color-accent)] tracking-widest uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="text-3xl lg:text-4xl font-semibold text-[var(--color-fg)] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[var(--color-muted)] text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
