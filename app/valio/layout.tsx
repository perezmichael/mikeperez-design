import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Mike Perez — Product designer",
  description: "Product designer at Apple in Los Angeles. I design AI products — then I build them.",
};

export const viewport: Viewport = {
  themeColor: "#F7F4ED",
};

export default function ValioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
