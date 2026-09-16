"use client";

import { usePathname } from "next/navigation";

interface SiteChromeProps {
  nav: React.ReactNode;
  footer: React.ReactNode;
  toggle: React.ReactNode;
  children: React.ReactNode;
}

export function SiteChrome({ nav, footer, toggle, children }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/valio")) return <>{children}</>;

  return (
    <>
      {nav}
      <div className="flex-1 pt-16">{children}</div>
      {footer}
      {toggle}
    </>
  );
}
