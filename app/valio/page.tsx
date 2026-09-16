import Link from "next/link";

const OPTIONS = [
  { href: "/valio/card", tag: "A", name: "The Card", note: "Name, intro, three QR tiles. Tap a tile and the code goes full screen." },
  { href: "/valio/flip", tag: "B", name: "The Flip", note: "Photo-led card with a live theme dock — reskin it mid-conversation." },
  { href: "/valio/loop", tag: "C", name: "The Loop", note: "Full-screen story cards to hand across the table. Tap or swipe." },
];

export default function ValioIndex() {
  return (
    <div data-valio data-theme="isla" className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)]">
      <main className="mx-auto max-w-md px-6 pb-12 pt-[max(3rem,env(safe-area-inset-top))]">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)]">ValioCon cards</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">Pick a card.</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
          Three takes on the same conference card. Open each on your phone and hold it out like you would at the booth.
        </p>
        <ul className="mt-8 space-y-3">
          {OPTIONS.map((o) => (
            <li key={o.href}>
              <Link
                href={o.href}
                className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-transform active:scale-[0.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-mono text-sm text-[var(--color-on-accent)]">
                  {o.tag}
                </span>
                <span>
                  <span className="block font-semibold">{o.name}</span>
                  <span className="block text-[13px] leading-snug text-[var(--color-muted)]">{o.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
