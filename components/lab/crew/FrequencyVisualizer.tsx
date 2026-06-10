"use client";

import { useRef, useEffect } from "react";

interface FrequencyVisualizerProps {
  bass: number;
  mid: number;
  high: number;
  isBeat: boolean;
  isPlaying: boolean;
}

const RING_COUNT = 7;
const RING_DELAY_FRAMES = 4;

export default function FrequencyVisualizer({ bass, mid, isBeat, isPlaying }: FrequencyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>(new Array(RING_COUNT * RING_DELAY_FRAMES).fill(0));
  const beatFlashRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      if (!isPlaying) {
        // Idle: draw one gentle breathing ring
        const t = Date.now() / 1000;
        const pulse = Math.sin(t * 0.8) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60 + pulse * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,168,67,${0.08 + pulse * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        raf = requestAnimationFrame(draw);
        return;
      }

      historyRef.current.unshift(bass);
      historyRef.current = historyRef.current.slice(0, RING_COUNT * RING_DELAY_FRAMES);

      if (isBeat) beatFlashRef.current = 8;
      else if (beatFlashRef.current > 0) beatFlashRef.current--;

      // Anchor point: lower-left area of canvas
      const cx = w * 0.35;
      const cy = h * 0.72;
      const baseRadius = Math.min(w, h) * 0.08;

      for (let i = 0; i < RING_COUNT; i++) {
        const histIdx = i * RING_DELAY_FRAMES;
        const energy = historyRef.current[histIdx] ?? 0;
        const radius = baseRadius + energy * Math.min(w, h) * 0.28 - i * 6;

        if (radius <= 0) continue;

        const alpha = Math.max(0, (1 - i / RING_COUNT) * (0.12 + energy * 0.55));
        const lineWidth = Math.max(0.5, (1 - i / RING_COUNT) * (1 + energy * 2));

        const flashBoost = i === 0 && beatFlashRef.current > 0
          ? (beatFlashRef.current / 8) * 0.4
          : 0;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,168,67,${Math.min(1, alpha + flashBoost)})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Horizontal waveform line under hero text area
      const lineY = h * 0.78;
      const lineLeft = w * 0.05;
      const lineRight = w * 0.65;
      const lineLen = lineRight - lineLeft;

      ctx.beginPath();
      for (let x = lineLeft; x <= lineRight; x += 2) {
        const progress = (x - lineLeft) / lineLen;
        const wave = Math.sin(progress * 12 + Date.now() / 300) * (mid * 8);
        if (x === lineLeft) ctx.moveTo(x, lineY + wave);
        else ctx.lineTo(x, lineY + wave);
      }
      ctx.strokeStyle = `rgba(212,168,67,${0.1 + mid * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [bass, mid, isBeat, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
