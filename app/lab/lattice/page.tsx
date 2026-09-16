"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Effect = "lattice" | "benday" | "riso";
type Glyph = "star" | "cross" | "dot";
type MarkPalette = "isla" | "lava" | "mono";
type BdPalette = "classic" | "isla";
type InkSet = "pink-teal" | "orange-blue" | "isla";

const ACCENT_SETS: Record<MarkPalette, string[]> = {
  isla: ["#0F6E4F", "#F2421B", "#2563EB"],
  lava: ["#16A34A", "#2563EB", "#DB2777"],
  mono: ["#444444"],
};

const BD_PALETTES: Record<BdPalette, { paper: string; yellow: string; red: string; blue: string; ink: string; rgb: number[][] }> = {
  classic: {
    paper: "#FDF6E3", yellow: "#F7D63C", red: "#E8352B", blue: "#2E5FD8", ink: "#181818",
    rgb: [[253, 246, 227], [247, 214, 60], [232, 53, 43], [46, 95, 216], [24, 24, 24]],
  },
  isla: {
    paper: "#F7F4ED", yellow: "#F6C36B", red: "#F2421B", blue: "#0F6E4F", ink: "#21241F",
    rgb: [[247, 244, 237], [246, 195, 107], [242, 66, 27], [15, 110, 79], [33, 36, 31]],
  },
};

const INK_SETS: Record<InkSet, { paper: string; inks: [string, string] }> = {
  "pink-teal":   { paper: "#F6F1E5", inks: ["#FF48B0", "#00838A"] },
  "orange-blue": { paper: "#F4EFE2", inks: ["#FF6C2F", "#0078BF"] },
  isla:          { paper: "#F7F4ED", inks: ["#F2421B", "#0F6E4F"] },
};

const makeRng = (seed: number) => {
  let s = (seed % 2147483646) + 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

/* Procedural impasto-ish default so the tool demos without an upload */
function paintDefault(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#F3D9CE";
  ctx.fillRect(0, 0, w, h);

  const palette = ["#F2AB8E", "#EE7F51", "#F2421B", "#E85D8A", "#F6C36B", "#F8EFE4", "#FDF6EC", "#D9755B"];
  const cx = w * 0.5;
  const cy = h * 0.62;

  for (let i = 0; i < 340; i++) {
    const burst = i > 60;
    const ang = Math.random() * Math.PI * 2;
    const dist = burst
      ? Math.pow(Math.random(), 0.6) * Math.min(w, h) * 0.52
      : Math.random() * Math.max(w, h) * 0.75;
    const x = burst ? cx + Math.cos(ang) * dist : Math.random() * w;
    const y = burst ? cy + Math.sin(ang) * dist * 0.8 : Math.random() * h;
    const len = 30 + Math.random() * (burst ? 150 : 90);
    const thick = 10 + Math.random() * 26;
    const rot = burst ? ang + Math.PI / 2 + (Math.random() - 0.5) * 0.6 : Math.random() * Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = 0.55 + Math.random() * 0.45;
    ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
    ctx.beginPath();
    const r = thick / 2;
    ctx.moveTo(-r, -len / 2 + r);
    ctx.quadraticCurveTo(-r, -len / 2, 0, -len / 2);
    ctx.quadraticCurveTo(r, -len / 2, r, -len / 2 + r);
    ctx.lineTo(r * (0.6 + Math.random() * 0.4), len / 2 - r);
    ctx.quadraticCurveTo(r, len / 2, 0, len / 2);
    ctx.quadraticCurveTo(-r, len / 2, -r, len / 2 - r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  return c;
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.closePath();
  ctx.fill();
}

function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const t = Math.max(1, r * 0.28);
  ctx.fillRect(x - t / 2, y - r, t, r * 2);
  ctx.fillRect(x - r, y - t / 2, r * 2, t);
}

interface Cluster { x: number; y: number; r: number; color: number }

function makeClusters(seed: number, count: number): Cluster[] {
  const rnd = makeRng(seed);
  return Array.from({ length: count }, () => ({
    x: 0.08 + rnd() * 0.84,
    y: 0.08 + rnd() * 0.84,
    r: 0.03 + rnd() * 0.07,
    color: Math.floor(rnd() * 3),
  }));
}

interface Pix { data: Uint8ClampedArray; w: number; h: number }

export default function LatticePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const pixRef = useRef<Pix | null>(null);
  const lumRef = useRef<Float32Array | null>(null);
  const edgeRef = useRef<Float32Array | null>(null);

  const [effect, setEffect] = useState<Effect>("lattice");

  /* ?effect=benday|riso deep-links into a mode (read post-hydration) */
  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("effect");
    if (e === "benday" || e === "riso") setEffect(e);
  }, []);

  /* lattice */
  const [cell, setCell] = useState(20);
  const [gain, setGain] = useState(1.4);
  const [glyph, setGlyph] = useState<Glyph>("star");
  const [clusters, setClusters] = useState(0.5);
  const [markPalette, setMarkPalette] = useState<MarkPalette>("isla");

  /* ben-day */
  const [dotSize, setDotSize] = useState(16);
  const [lineWeight, setLineWeight] = useState(0.5);
  const [bdPalette, setBdPalette] = useState<BdPalette>("classic");

  /* riso */
  const [inkSet, setInkSet] = useState<InkSet>("pink-teal");
  const [grain, setGrain] = useState(0.5);
  const [misreg, setMisreg] = useState(0.5);

  const [seed, setSeed] = useState(7);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  /* Cache pixels + luminance once per image; edge map computed lazily */
  const analyze = useCallback((src: HTMLCanvasElement) => {
    const { data } = src.getContext("2d")!.getImageData(0, 0, src.width, src.height);
    pixRef.current = { data, w: src.width, h: src.height };
    const lum = new Float32Array(src.width * src.height);
    for (let i = 0; i < lum.length; i++) {
      lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
    }
    lumRef.current = lum;
    edgeRef.current = null;
  }, []);

  /* Sobel magnitude over the luminance grid, cached per image */
  const getEdges = useCallback((): Float32Array | null => {
    if (edgeRef.current) return edgeRef.current;
    const pix = pixRef.current;
    const lum = lumRef.current;
    if (!pix || !lum) return null;
    const { w, h } = pix;
    const e = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx =
          lum[i - w + 1] + 2 * lum[i + 1] + lum[i + w + 1] -
          lum[i - w - 1] - 2 * lum[i - 1] - lum[i + w - 1];
        const gy =
          lum[i + w - 1] + 2 * lum[i + w] + lum[i + w + 1] -
          lum[i - w - 1] - 2 * lum[i - w] - lum[i - w + 1];
        e[i] = Math.sqrt(gx * gx + gy * gy);
      }
    }
    edgeRef.current = e;
    return e;
  }, []);

  const renderLattice = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, scale: number) => {
    const src = sourceRef.current!;
    const pix = pixRef.current!;
    const lum = lumRef.current!;
    ctx.drawImage(src, 0, 0, W, H);

    const step = cell * scale;
    const clusterList = makeClusters(seed, Math.round(clusters * 14));
    const accents = ACCENT_SETS[markPalette];

    for (let y = step / 2; y < H; y += step) {
      for (let x = step / 2; x < W; x += step) {
        const sx = Math.min(pix.w - 1, Math.floor(x / scale));
        const sy = Math.min(pix.h - 1, Math.floor(y / scale));
        const v = Math.pow(lum[sy * pix.w + sx], gain);

        const nx = x / W, ny = y / H;
        const hit = clusterList.find((c) => {
          const dx = nx - c.x, dy = ny - c.y;
          return dx * dx + dy * dy < c.r * c.r;
        });

        if (hit) {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = accents[hit.color % accents.length];
          drawCross(ctx, x, y, step * 0.28);
        } else {
          const r = step * (0.12 + v * 0.42);
          ctx.globalAlpha = 0.25 + v * 0.65;
          ctx.fillStyle = "#FFFFFF";
          if (glyph === "star") drawStar(ctx, x, y, r);
          else if (glyph === "cross") drawCross(ctx, x, y, r * 0.8);
          else { ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
        }
      }
    }
    ctx.globalAlpha = 1;
  }, [cell, gain, glyph, clusters, markPalette, seed]);

  const renderBenday = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, scale: number) => {
    const pix = pixRef.current!;
    const pal = BD_PALETTES[bdPalette];
    const colors = [pal.paper, pal.yellow, pal.red, pal.blue, pal.ink];

    ctx.fillStyle = pal.paper;
    ctx.fillRect(0, 0, W, H);

    const step = dotSize * scale;
    for (let y = step / 2; y < H; y += step) {
      for (let x = step / 2; x < W; x += step) {
        const sx = Math.min(pix.w - 1, Math.floor(x / scale));
        const sy = Math.min(pix.h - 1, Math.floor(y / scale));
        const i = (sy * pix.w + sx) * 4;
        const r = pix.data[i], g = pix.data[i + 1], b = pix.data[i + 2];

        let best = 0, bestD = Infinity;
        for (let k = 0; k < pal.rgb.length; k++) {
          const dr = r - pal.rgb[k][0], dg = g - pal.rgb[k][1], db = b - pal.rgb[k][2];
          const d = dr * dr + dg * dg + db * db;
          if (d < bestD) { bestD = d; best = k; }
        }

        if (best === 0) continue;
        ctx.fillStyle = colors[best];
        if (best === 1 || best === 4) {
          ctx.fillRect(x - step / 2 - 0.5, y - step / 2 - 0.5, step + 1, step + 1);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, step * 0.36, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (lineWeight > 0) {
      const edges = getEdges();
      if (edges) {
        const thr = 1.45 - lineWeight * 1.2;
        const t = (1.2 + lineWeight * 2.4) * scale;
        ctx.fillStyle = pal.ink;
        for (let y = 0; y < pix.h; y += 2) {
          for (let x = 0; x < pix.w; x += 2) {
            if (edges[y * pix.w + x] > thr) {
              ctx.fillRect(x * scale - t / 2, y * scale - t / 2, t, t);
            }
          }
        }
      }
    }
  }, [bdPalette, dotSize, lineWeight, getEdges]);

  const renderRiso = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, scale: number) => {
    const pix = pixRef.current!;
    const lum = lumRef.current!;
    const set = INK_SETS[inkSet];

    ctx.fillStyle = set.paper;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "multiply";

    const step = 2;
    const dot = (step + 0.4) * scale;

    for (let layer = 0; layer < 2; layer++) {
      const rnd = makeRng(seed * 31 + layer * 7919);
      const ox = (rnd() - 0.5) * misreg * 14 * scale;
      const oy = (rnd() - 0.5) * misreg * 14 * scale;
      const rot = (rnd() - 0.5) * misreg * 0.022;

      ctx.save();
      ctx.translate(W / 2 + ox, H / 2 + oy);
      ctx.rotate(rot);
      ctx.translate(-W / 2, -H / 2);
      ctx.fillStyle = set.inks[layer];
      ctx.globalAlpha = 0.85;

      for (let sy = 0; sy < pix.h; sy += step) {
        for (let sx = 0; sx < pix.w; sx += step) {
          const i = (sy * pix.w + sx) * 4;
          const channel = layer === 0 ? pix.data[i + 1] : pix.data[i];
          const dark = 1 - lum[sy * pix.w + sx];
          let p = (1 - channel / 255) * 0.8 + dark * 0.28;
          p = Math.pow(Math.min(1, p), 1.25);
          p += (rnd() - 0.5) * grain * 0.55;
          if (rnd() < p) {
            ctx.fillRect(sx * scale, sy * scale, dot, dot);
          }
        }
      }
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }, [inkSet, grain, misreg, seed]);

  const render = useCallback((scale = 1): HTMLCanvasElement | null => {
    const src = sourceRef.current;
    if (!src || !pixRef.current || !lumRef.current) return null;
    const canvas = scale === 1 ? canvasRef.current : document.createElement("canvas");
    if (!canvas) return null;

    canvas.width = src.width * scale;
    canvas.height = src.height * scale;
    const ctx = canvas.getContext("2d")!;

    if (effect === "lattice") renderLattice(ctx, canvas.width, canvas.height, scale);
    else if (effect === "benday") renderBenday(ctx, canvas.width, canvas.height, scale);
    else renderRiso(ctx, canvas.width, canvas.height, scale);
    return canvas;
  }, [effect, renderLattice, renderBenday, renderRiso]);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxW = 1600;
      const w = Math.min(maxW, img.naturalWidth);
      const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      sourceRef.current = c;
      analyze(c);
      setFileName(file.name);
      URL.revokeObjectURL(url);
      render();
    };
    img.src = url;
  }, [analyze, render]);

  useEffect(() => {
    if (!sourceRef.current) {
      const c = paintDefault(1280, 720);
      sourceRef.current = c;
      analyze(c);
    }
    /* setTimeout, not rAF: rAF is suspended in backgrounded/embedded
       browsers, which would leave the canvas blank on first paint */
    setBusy(true);
    const id = setTimeout(() => { render(); setBusy(false); }, 10);
    return () => clearTimeout(id);
  }, [analyze, render]);

  const exportPng = () => {
    const out = render(2);
    if (!out) return;
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `mp-${effect}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const regenerate = () => {
    const c = paintDefault(1280, 720);
    sourceRef.current = c;
    analyze(c);
    setFileName(null);
    render();
  };

  const label = "font-mono text-[10px] tracking-widest uppercase text-[var(--color-muted)]";
  const segBtn = (on: boolean) =>
    `flex-1 py-1.5 rounded-md font-mono text-[10px] tracking-widest uppercase border transition-colors ${
      on
        ? "bg-[var(--color-accent)] text-[var(--color-on-accent)] border-[var(--color-accent)]"
        : "border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
    }`;
  const ghostBtn =
    "w-full py-1.5 rounded-md border border-[var(--color-border)] font-mono text-[10px] tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-muted)] transition-colors";

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-12"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 6H2M6 10l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Lab
        </Link>

        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-accent)] mb-4">Experiment 08</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-fg)] mb-6">Lattice</h1>
          <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
            One image pipeline, three print heads: the AI-brand glyph lattice, Ben-Day
            pop-art halftone, and two-ink riso overprint. Drop in any image, tune the
            effect, export at 2x. The default canvas is procedural paint.
          </p>
        </div>

        {/* Effect switcher */}
        <div className="flex gap-1 mb-6 max-w-sm">
          {(["lattice", "benday", "riso"] as Effect[]).map((e) => (
            <button key={e} onClick={() => setEffect(e)} className={segBtn(effect === e)}>
              {e === "benday" ? "Ben-Day" : e}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f && f.type.startsWith("image/")) loadFile(f);
          }}
          className={`relative rounded-2xl overflow-hidden border transition-colors ${
            dragOver ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
          }`}
        >
          <canvas ref={canvasRef} className="w-full h-auto block" />
          {busy && (
            <div className="absolute top-3 right-3 font-mono text-[9px] tracking-widest uppercase text-[var(--color-muted)]">
              rendering…
            </div>
          )}
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/70 font-mono text-xs tracking-widest uppercase text-[var(--color-accent)]">
              Drop image to print it
            </div>
          )}
        </div>

        {/* Per-effect controls */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {effect === "lattice" && (
            <>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Cell size</span><span className={label}>{cell}px</span></div>
                <input type="range" min={10} max={44} step={1} value={cell} onChange={(e) => setCell(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Response</span><span className={label}>{gain.toFixed(1)}</span></div>
                <input type="range" min={0.4} max={3} step={0.1} value={gain} onChange={(e) => setGain(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Clusters</span><span className={label}>{Math.round(clusters * 100)}%</span></div>
                <input type="range" min={0} max={1} step={0.05} value={clusters} onChange={(e) => setClusters(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <span className={`${label} block mb-2`}>Glyph</span>
                <div className="flex gap-1">
                  {(["star", "cross", "dot"] as Glyph[]).map((g) => (
                    <button key={g} onClick={() => setGlyph(g)} className={segBtn(glyph === g)}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <span className={`${label} block mb-2`}>Mark palette</span>
                <div className="flex gap-1">
                  {(["isla", "lava", "mono"] as MarkPalette[]).map((p) => (
                    <button key={p} onClick={() => setMarkPalette(p)} className={segBtn(markPalette === p)}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {effect === "benday" && (
            <>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Dot size</span><span className={label}>{dotSize}px</span></div>
                <input type="range" min={8} max={36} step={1} value={dotSize} onChange={(e) => setDotSize(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Line weight</span><span className={label}>{lineWeight === 0 ? "off" : lineWeight.toFixed(2)}</span></div>
                <input type="range" min={0} max={1} step={0.05} value={lineWeight} onChange={(e) => setLineWeight(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <span className={`${label} block mb-2`}>Palette</span>
                <div className="flex gap-1">
                  {(["classic", "isla"] as BdPalette[]).map((p) => (
                    <button key={p} onClick={() => setBdPalette(p)} className={segBtn(bdPalette === p)}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {effect === "riso" && (
            <>
              <div>
                <span className={`${label} block mb-2`}>Ink pair</span>
                <div className="flex gap-1">
                  {(["pink-teal", "orange-blue", "isla"] as InkSet[]).map((p) => (
                    <button key={p} onClick={() => setInkSet(p)} className={segBtn(inkSet === p)}>
                      {p === "pink-teal" ? "pink+teal" : p === "orange-blue" ? "org+blue" : p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Grain</span><span className={label}>{Math.round(grain * 100)}%</span></div>
                <input type="range" min={0} max={1} step={0.05} value={grain} onChange={(e) => setGrain(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
              <div>
                <div className="flex justify-between mb-2"><span className={label}>Misregister</span><span className={label}>{Math.round(misreg * 100)}%</span></div>
                <input type="range" min={0} max={1} step={0.05} value={misreg} onChange={(e) => setMisreg(+e.target.value)} className="w-full accent-[var(--color-accent)]" />
              </div>
            </>
          )}

          {/* Shared */}
          <div>
            <span className={`${label} block mb-2`}>{effect === "lattice" ? "Reseed marks" : "Reseed"}</span>
            <button onClick={() => setSeed(Math.floor(Math.random() * 99999) + 1)} className={ghostBtn}>
              Shuffle
            </button>
          </div>
          <div>
            <span className={`${label} block mb-2`}>Source</span>
            <div className="flex gap-1">
              <label className={`${ghostBtn} text-center cursor-pointer flex-1 w-auto`}>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
                />
              </label>
              <button onClick={regenerate} className={`${ghostBtn} flex-1 w-auto`}>Repaint</button>
            </div>
          </div>
          <div>
            <span className={`${label} block mb-2`}>Export</span>
            <button
              onClick={exportPng}
              className="w-full py-1.5 rounded-md bg-[var(--color-accent)] text-[var(--color-on-accent)] font-mono text-[10px] tracking-widest uppercase hover:brightness-110 transition-all shadow-[var(--btn-glow)]"
            >
              PNG · 2x
            </button>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-mono text-[var(--color-muted)]">
          {fileName ? `Source: ${fileName}` : "Source: procedural paint — drop any image onto the canvas to replace it."}
          {" "}Everything runs locally; nothing is uploaded.
        </p>
      </div>
    </main>
  );
}
