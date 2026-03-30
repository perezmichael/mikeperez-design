import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

const sizeStyles = {
  sm:   "max-w-2xl",
  md:   "max-w-4xl",
  lg:   "max-w-6xl",
  full: "max-w-none",
};

export function Container({ children, className, size = "lg" }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6 sm:px-8 lg:px-12",
        sizeStyles[size],
        className
      )}
    >
      {children}
    </div>
  );
}
