"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────────────
   Claura — a recreation of the Claura Framer template, focused on its
   animations: drifting gradient auras, a word-by-word blur-in hero, a
   count-up stat, an infinite marquee, scroll-reveal sections, a
   pointer-following card glow, and a scroll-driven process timeline.

   Warm espresso palette pulled from the template's CSS tokens
   (#2b180a espresso, #f6f0e9 cream, #dab697 / #e8d3c0 peach glows).
   ────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* Scroll-reveal wrapper: fade + rise + de-blur as it enters the viewport */
function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Count-up number that animates the first time it scrolls into view */
function StatCounter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(e * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{n}</span>;
}

/* Hero headline — words rise + de-blur in sequence */
const headlineWords = ["From", "AI", "confusion", "to", "clarity."];
const wordParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.7em", filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

/* Service step with a pointer-following highlight + hover lift */
function ServiceCard({
  index,
  title,
  desc,
  delay,
}: {
  index: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={{ y: -6 }}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-2xl border border-[#f6f0e9]/10 bg-[#f6f0e9]/[0.02] p-7 transition-colors duration-300 hover:border-[#dab697]/40"
    >
      {/* pointer-following glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(218,182,151,0.16), transparent 70%)",
        }}
      />
      <span className="font-mono text-xs text-[#dab697]">{index}</span>
      <h3 className="mt-4 text-xl font-medium text-[#f6f0e9]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#94877c]">{desc}</p>
    </motion.div>
  );
}

const phases = [
  {
    when: "Week 1",
    title: "Discovery & Assessment",
    desc: "We map your workflows and pinpoint where AI saves the most time and money.",
  },
  {
    when: "Weeks 2–4",
    title: "Build & Deploy",
    desc: "Custom automations built for how you work, then installed, tested, and launched.",
  },
  {
    when: "Ongoing",
    title: "Train & Support",
    desc: "Hands-on training and continuous optimization so the systems keep paying off.",
  },
];

function Timeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mx-auto max-w-2xl pl-10">
      {/* track */}
      <div className="absolute left-[14px] top-2 bottom-2 w-px bg-[#f6f0e9]/10" />
      {/* progress fill */}
      <motion.div
        style={{ scaleY }}
        className="absolute left-[14px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-[#e8d3c0] to-[#dab697]"
      />
      <div className="space-y-10">
        {phases.map((p, i) => (
          <Reveal key={p.when} delay={i * 0.08} className="relative">
            <span className="absolute -left-10 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#dab697]/40 bg-[#150d07] text-[10px] font-mono text-[#dab697]">
              {i + 1}
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-[#dab697]">
              {p.when}
            </p>
            <h3 className="mt-1.5 text-lg font-medium text-[#f6f0e9]">
              {p.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#94877c]">
              {p.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const marqueeItems = [
  "BrightPath",
  "Hamilton",
  "Northwind",
  "Lumen Labs",
  "Vertex",
  "Atlas Co.",
  "Meridian",
  "Coastline",
];

export default function ClauraSite() {
  return (
    <div className="relative overflow-hidden bg-[#150d07] text-[#f6f0e9]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-7 pb-24 md:px-10">
        {/* drifting gradient auras */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="claura-aura-a absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(218,182,151,0.45), transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="claura-aura-b absolute top-10 right-0 h-[45vh] w-[45vh] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(232,211,192,0.4), transparent 60%)",
              filter: "blur(70px)",
            }}
          />
          <div
            className="claura-aura-a absolute bottom-0 left-0 h-[40vh] w-[40vh] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(62,36,7,0.6), transparent 60%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        {/* nav */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 mx-auto flex max-w-5xl items-center justify-between rounded-full border border-[#f6f0e9]/10 bg-[#f6f0e9]/[0.03] px-5 py-2.5 backdrop-blur-md"
        >
          <span className="text-base font-semibold tracking-tight">Claura</span>
          <div className="hidden items-center gap-7 text-sm text-[#94877c] md:flex">
            {["About", "Services", "How We Work", "FAQ"].map((l) => (
              <span
                key={l}
                className="cursor-pointer transition-colors hover:text-[#f6f0e9]"
              >
                {l}
              </span>
            ))}
          </div>
          <button className="rounded-full bg-[#f6f0e9] px-4 py-2 text-xs font-medium text-[#150d07] transition-opacity hover:opacity-90">
            Book a free call
          </button>
        </motion.nav>

        {/* headline */}
        <div className="relative z-10 mx-auto mt-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f6f0e9]/10 bg-[#f6f0e9]/[0.03] px-3.5 py-1.5 text-xs text-[#94877c]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#dab697]" />
            AI automation, done for you
          </motion.div>

          <motion.h1
            variants={wordParent}
            initial="hidden"
            animate="show"
            className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          >
            {headlineWords.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span variants={wordChild} className="inline-block">
                  {w}
                </motion.span>
                {i < headlineWords.length - 1 && " "}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#94877c]"
          >
            We identify where AI saves time and money in your business, then
            build and implement the systems that make it happen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-gradient-to-b from-[#f6f0e9] to-[#e8d3c0] px-6 py-3 text-sm font-medium text-[#150d07] shadow-[0_8px_30px_-8px_rgba(218,182,151,0.5)]"
            >
              Book a free call
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-[#150d07]"
                    style={{
                      background: `linear-gradient(135deg, hsl(${
                        24 + i * 14
                      } 45% ${60 - i * 6}%), hsl(${18 + i * 10} 40% 40%))`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#94877c]">
                Helped over{" "}
                <span className="font-semibold text-[#f6f0e9]">
                  <StatCounter to={100} />+
                </span>{" "}
                businesses
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <section className="relative border-y border-[#f6f0e9]/10 py-6">
        <div className="claura-marquee-track flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="claura-marquee flex shrink-0 items-center gap-12 pr-12">
            {[...marqueeItems, ...marqueeItems].map((m, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-lg font-medium text-[#94877c]/70"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#dab697]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              A clear path, four steps.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              index="01"
              title="Discover"
              desc="We analyze your workflows and identify where automation creates the most value."
              delay={0}
            />
            <ServiceCard
              index="02"
              title="Build"
              desc="Custom automation designed for how you work, eliminating repetitive tasks."
              delay={0.08}
            />
            <ServiceCard
              index="03"
              title="Deploy"
              desc="We handle installation, testing, and a smooth launch into your stack."
              delay={0.16}
            />
            <ServiceCard
              index="04"
              title="Optimize"
              desc="Ongoing training and support so the systems keep getting better."
              delay={0.24}
            />
          </div>
        </div>
      </section>

      {/* ── How we work (scroll-driven timeline) ─────────────── */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#dab697]">
              How we work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              From kickoff to compounding results.
            </h2>
          </Reveal>
          <Timeline />
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
            &ldquo;They didn&apos;t overwhelm us with options. They just built
            exactly what we needed. We&apos;re saving 15 hours a week.&rdquo;
          </p>
          <p className="mt-6 text-sm text-[#94877c]">
            <span className="text-[#f6f0e9]">Sarah Chen</span> — Founder at
            BrightPath Consulting
          </p>
        </Reveal>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 md:px-10">
        <div
          className="claura-aura-b pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(218,182,151,0.35), transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Turn confusion into{" "}
            <span
              className="claura-shimmer bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#dab697,#fcf6ef,#e8d3c0,#dab697)",
              }}
            >
              clarity
            </span>
            , today.
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 rounded-full bg-gradient-to-b from-[#f6f0e9] to-[#e8d3c0] px-7 py-3.5 text-sm font-medium text-[#150d07] shadow-[0_8px_30px_-8px_rgba(218,182,151,0.5)]"
          >
            Book a free call
          </motion.button>
        </Reveal>
      </section>
    </div>
  );
}
