import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export function Card({ children, className, hover = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden",
        hover && "transition-all duration-200 hover:border-[var(--color-muted)] hover:translate-y-[-2px] cursor-pointer",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5", className)}>
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("w-full bg-[var(--color-border)] aspect-video overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
