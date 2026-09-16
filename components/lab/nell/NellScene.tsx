"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────
   Nell — a recreation of nell.ai's stealth landing.

   The signature effect is animated ASCII: the manifesto text is laid
   out in a dense monospace grid, and a slowly churning domain-warped
   noise field drives each glyph's colour/brightness while scrambling
   characters in the turbulent zones. The copy stays readable where the
   field is calm and dissolves into noise where it churns — a wall of
   text that behaves like smoke.

   The audio is a procedural ambient drone synthesised on the fly; the
   real manifesto track is private so we don't borrow the asset.
   ────────────────────────────────────────────────────────────────── */

/* The manifesto copy (uppercase), echoing the live site. Repeated to
   fill the grid so phrases stay legible across the canvas. */
const MANIFESTO =
  "NELL IS REIMAGINING MEDIA FOR THE AI ERA. WE ARE BUILDING A PLATFORM THAT LETS ANYONE CREATE AND STREAM SHOWS ABOUT ANYTHING THEY'RE CURIOUS ABOUT. WE ARE TAKING THE WORLD FROM FIXED AND LINEAR TO FLUID MEDIA: GENERATIVE, INTERACTIVE, AND INFINITELY REMIXABLE. THINK OF NELL AS AI STREAMING. WE TAKE EVERYTHING YOU KNOW AND LOVE ABOUT STREAMING — UBIQUITOUS ACCESS, CURATION, DISCOVERY, AND INSTANT PLAYBACK — AND PUT IT AT YOUR COMMAND. YOU WILL INTERACT WITH SHOWS IN REAL TIME. REMIX WHAT YOU SEE AND HEAR. WE WANT TO DEMOCRATIZE THE PERSONAL STORYTELLERS, AND EXPERT DOCUMENTARIANS, THERE TO HELP YOUR MIND STRETCH AND EXPAND. EVERY CURIOUS SOUL BECOMES BOTH PUPIL AND CREATOR — A COMMON PLATFORM TO HELP US LEARN, CREATE, DREAM, AND BECOME. GENERATIVE AI IS ALL SLOP, THEY SAY. MODEL OUTPUTS LACK HUMAN TASTE, HUMAN DRIVE, AND HUMAN PASSION. THEY CONVERGE ON THE COMMON DOMINATOR. THEY SUFFER FROM BLANDNESS AND MODE COLLAPSE. THE CRITICS ARE PARTLY RIGHT, BUT FOR THE REASONS THEY THINK. AT NELL, WE BELIEVE THE FINEST GENERATIVE FEATS ARE STILL AHEAD OF US. EVERY GENERATION INHERITS A NEW MEDIUM. OURS IS TAKING SHAPE. ";

/* Every glyph the atlas needs — manifesto characters plus the "soup"
   the flow field scrambles in. Index 0 is a space (renders nothing). */
const GLYPHS =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;'/\\|()<>[]{}*+=-_~^?!&%#@—";

const glyphIndexOf = (ch: string): number => {
  const i = GLYPHS.indexOf(ch);
  return i < 0 ? 0 : i;
};

/* ── GLSL — ASCII via a glyph atlas, all on the GPU ─────────────── */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_intensity;
uniform vec2  u_cell;          // cell size in device px
uniform float u_cols;
uniform float u_rows;
uniform float u_atlasCount;    // number of glyphs in the atlas
uniform float u_manifestoLen;
uniform float u_scroll;        // whole-row vertical drift
uniform float u_seed;          // re-rolls scrambled glyphs over time
uniform sampler2D u_atlas;     // LINEAR — the glyph strip
uniform sampler2D u_manifesto; // NEAREST — manifesto char -> glyph index

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) { v += amp * noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}
float field(vec2 nrm, float t, float aspect) {
  vec2 p = vec2((nrm.x - 0.5) * aspect * 3.0, (nrm.y - 0.5) * 3.0);
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(
    fbm(p + 1.8 * q + vec2(1.7, 9.2) + 0.12 * t),
    fbm(p + 1.8 * q + vec2(8.3, 2.8) - 0.10 * t)
  );
  float f = fbm(p + 2.4 * r);
  return f * f;
}
vec3 ramp(float l) {
  if (l < 0.40) { float k = l / 0.40; return vec3(0.16 + k * 0.31, k * 0.03, k * 0.024); }
  if (l < 0.78) { float k = (l - 0.40) / 0.38; return vec3(0.47 + k * 0.37, 0.03 + k * 0.21, 0.024 + k * 0.10); }
  float k = (l - 0.78) / 0.22;
  return vec3(0.84 + k * 0.10, 0.24 + k * 0.59, 0.12 + k * 0.51);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float py = u_res.y - fc.y;                 // top-down
  float col = floor(fc.x / u_cell.x);
  float row = floor(py / u_cell.y);
  vec2 local = vec2(fract(fc.x / u_cell.x), fract(py / u_cell.y));

  vec2 nrm = vec2((col + 0.5) / u_cols, (row + 0.5) / u_rows);
  nrm += (u_mouse - 0.5) * 0.05 * vec2(1.0, -1.0);

  float t = u_time * 0.18;
  float aspect = u_res.x / u_res.y;
  float v = field(nrm, t, aspect);
  float lum = min(1.0, v * (1.18 + 0.5 * u_intensity));

  vec3 bg = vec3(0.086, 0.0, 0.0);
  if (lum < 0.16) { gl_FragColor = vec4(bg, 1.0); return; }

  // Glyph selection: readable manifesto where calm; scrambled only in the
  // hottest cells, and only a fraction of those, so the copy stays legible.
  float idx = row * u_cols + col + u_scroll * u_cols;
  float gi;
  float corrupt = step(0.80, lum) * step(0.66, hash(vec2(col + u_seed * 1.7, row - u_seed * 1.1)));
  if (corrupt > 0.5) {
    float rr = hash(vec2(col * 1.3 + u_seed * 2.1, row * 0.7 - u_seed * 1.3));
    gi = floor(rr * u_atlasCount);
  } else {
    float mu = (mod(idx, u_manifestoLen) + 0.5) / u_manifestoLen;
    gi = floor(texture2D(u_manifesto, vec2(mu, 0.5)).r * 255.0 + 0.5);
  }

  // sample the glyph out of the atlas strip
  float au = (gi + local.x) / u_atlasCount;
  float cov = texture2D(u_atlas, vec2(au, local.y)).a;

  gl_FragColor = vec4(mix(bg, ramp(lum), cov), 1.0);
}
`;

/* ── Ambient drone (the "manifesto" stand-in) ───────────────────── */
class AmbientDrone {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  nodes: OscillatorNode[] = [];
  lfo: OscillatorNode | null = null;

  start() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 2.2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.7;
    filter.connect(master);
    master.connect(ctx.destination);
    this.master = master;

    const freqs = [73.42, 110.0, 174.61];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 2 ? "triangle" : "sine";
      osc.frequency.value = freq;
      osc.detune.value = (i - 1) * 6;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.35 : 0.6;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      this.nodes.push(osc);
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;
  }

  stop() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    const nodes = [...this.nodes, this.lfo].filter(Boolean) as OscillatorNode[];
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      ctx.close();
    }, 1100);
    this.nodes = [];
    this.lfo = null;
    this.master = null;
    this.ctx = null;
  }
}

/* ── Component ──────────────────────────────────────────────────── */
export default function NellScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const intensityRef = useRef(0);
  const targetIntensity = useRef(0);
  const droneRef = useRef<AmbientDrone | null>(null);

  const [playing, setPlaying] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  /* Animated ASCII render loop — glyph atlas + fragment shader (GPU) */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* program */
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* glyph atlas — one horizontal strip, white glyphs on transparent */
    const ACW = 18;
    const ACH = 30;
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = GLYPHS.length * ACW;
    atlasCanvas.height = ACH;
    const a2d = atlasCanvas.getContext("2d")!;
    a2d.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
    a2d.fillStyle = "#fff";
    a2d.font = `600 ${Math.floor(ACH * 0.82)}px ui-monospace, "SF Mono", Menlo, monospace`;
    a2d.textAlign = "center";
    a2d.textBaseline = "middle";
    for (let i = 0; i < GLYPHS.length; i++) {
      a2d.fillText(GLYPHS[i], i * ACW + ACW / 2, ACH / 2 + 1);
    }

    const atlasTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /* manifesto index map — one byte per character */
    const manifestoData = new Uint8Array(MANIFESTO.length);
    for (let i = 0; i < MANIFESTO.length; i++)
      manifestoData[i] = glyphIndexOf(MANIFESTO[i]);
    const manifestoTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, manifestoTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      MANIFESTO.length,
      1,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      manifestoData
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /* uniforms */
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("u_res");
    const uTime = U("u_time");
    const uMouse = U("u_mouse");
    const uIntensity = U("u_intensity");
    const uCell = U("u_cell");
    const uCols = U("u_cols");
    const uRows = U("u_rows");
    const uAtlasCount = U("u_atlasCount");
    const uManifestoLen = U("u_manifestoLen");
    const uScroll = U("u_scroll");
    const uSeed = U("u_seed");
    gl.uniform1i(U("u_atlas"), 0);
    gl.uniform1i(U("u_manifesto"), 1);
    gl.uniform1f(uAtlasCount, GLYPHS.length);
    gl.uniform1f(uManifestoLen, MANIFESTO.length);

    let dpr = 1;
    let cellW = 1;
    let cellH = 1;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      // fine grid: ~5.5 x 9 CSS px per cell
      cellW = Math.max(5, Math.round(5.5 * dpr));
      cellH = Math.max(8, Math.round(9 * dpr));
      cols = Math.ceil(w / cellW);
      rows = Math.ceil(h / cellH);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      intensityRef.current +=
        (targetIntensity.current - intensityRef.current) * 0.05;
      const seconds = reduce ? 33 : (now - start) / 1000;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.uniform2f(uCell, cellW, cellH);
      gl.uniform1f(uCols, cols);
      gl.uniform1f(uRows, rows);
      gl.uniform1f(uScroll, Math.floor(seconds * 1.08));
      gl.uniform1f(uSeed, Math.floor(now / 90));

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    if (reduce) draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current = [
      (e.clientX - r.left) / r.width,
      (e.clientY - r.top) / r.height,
    ];
  }, []);

  const togglePlay = useCallback(() => {
    if (!droneRef.current) droneRef.current = new AmbientDrone();
    if (playing) {
      droneRef.current.stop();
      droneRef.current = null;
      targetIntensity.current = 0;
      setPlaying(false);
    } else {
      droneRef.current.start();
      targetIntensity.current = 1;
      setPlaying(true);
    }
  }, [playing]);

  useEffect(() => {
    return () => {
      droneRef.current?.stop();
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  return (
    <div
      onPointerMove={onMove}
      className="relative h-full w-full overflow-hidden bg-[#160000] text-[#f4ead7] select-none"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
        <span
          className="text-xl md:text-2xl tracking-tight text-[#f4ead7] mix-blend-difference"
          style={{ fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          nell
        </span>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause manifesto" : "Play manifesto"}
          className="group flex items-center gap-2.5"
        >
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4ead7]/60 transition-colors group-hover:text-[#f4ead7] sm:inline">
            {playing ? "Playing" : "Manifesto"}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f4ead7]/30 bg-[#160000]/40 backdrop-blur-sm transition-colors group-hover:border-[#f4ead7]/70">
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        </button>
      </header>

      {/* Center CTA */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.button
          type="button"
          onClick={() => {
            setWaitlistOpen(true);
            setJoined(false);
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border border-[#f4ead7]/40 bg-[#160000]/55 px-7 py-3 text-sm font-medium tracking-wide text-[#f4ead7] backdrop-blur-md transition-colors hover:bg-[#160000]/75"
        >
          Join the waitlist
        </motion.button>
      </div>

      {/* Bottom dock — manifesto line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-[#f4ead7]/55 md:pb-8 md:text-[11px]"
      >
        Every generation inherits a new medium. Ours is taking shape.
      </motion.p>

      {/* Waitlist modal */}
      <AnimatePresence>
        {waitlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#160000]/75 backdrop-blur-md"
            onClick={() => setWaitlistOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-6 w-full max-w-sm rounded-2xl border border-[#f4ead7]/15 bg-[#1c0000]/85 p-8 shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setWaitlistOpen(false)}
                className="absolute right-4 top-4 text-[#f4ead7]/40 transition-colors hover:text-[#f4ead7]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              {joined ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#f4ead7]/25">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#f4ead7]">
                    You&apos;re on the list.
                  </h3>
                  <p className="mt-2 text-sm text-[#f4ead7]/55">
                    We&apos;ll be in touch when the medium takes shape.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium tracking-tight text-[#f4ead7]">
                    Request access
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#f4ead7]/55">
                    Nell is in private beta. Leave your email to join the
                    waitlist.
                  </p>
                  <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-full border border-[#f4ead7]/20 bg-[#f4ead7]/5 px-5 py-3 text-sm text-[#f4ead7] placeholder:text-[#f4ead7]/35 outline-none transition-colors focus:border-[#f4ead7]/50"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#f4ead7] px-5 py-3 text-sm font-medium text-[#3a0000] transition-opacity hover:opacity-90"
                    >
                      Join the waitlist
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
