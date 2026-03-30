import { cn } from "@/lib/utils";

type TagVariant = "default" | "accent" | "muted" | "outline";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default:
    "bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20",
  muted:
    "bg-transparent text-[var(--color-muted)]",
  outline:
    "bg-transparent text-[var(--color-fg)] border border-[var(--color-border)]",
};

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs px-2.5 py-1 rounded-full tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
