// Hand-keyed frequency timeline for "Crew" by GoldLink ft. Brent Faiyaz & Shy Glizzy
// BPM: ~90 | Beat interval: ~667ms
// Energy values: 0.0 (silent) → 1.0 (full drop)

export interface BeatEvent {
  timeMs: number;
  bass: number;    // 0-1 kick drum / sub energy
  mid: number;     // 0-1 mid-range energy
  high: number;    // 0-1 hi-hat / treble energy
  isBeat: boolean; // true on downbeat
}

const BPM = 90;
const BEAT_MS = (60 / BPM) * 1000; // ~667ms

// Song sections with energy levels
const sections: { startMs: number; endMs: number; bass: number; mid: number; high: number }[] = [
  { startMs: 0,     endMs: 3000,  bass: 0.0, mid: 0.0, high: 0.0 },  // Dead silence intro
  { startMs: 3000,  endMs: 8000,  bass: 0.2, mid: 0.15, high: 0.1 }, // Soft intro build
  { startMs: 8000,  endMs: 21000, bass: 0.55, mid: 0.4, high: 0.35 }, // Verse 1 - GoldLink
  { startMs: 21000, endMs: 35000, bass: 0.65, mid: 0.5, high: 0.4 },  // Verse 1 continued
  { startMs: 35000, endMs: 65000, bass: 0.9, mid: 0.75, high: 0.6 },  // CHORUS - "we dem boyz"
  { startMs: 65000, endMs: 90000, bass: 0.6, mid: 0.45, high: 0.4 },  // Verse 2 - Brent Faiyaz
  { startMs: 90000, endMs: 125000, bass: 0.92, mid: 0.8, high: 0.65 }, // CHORUS 2 - peak energy
  { startMs: 125000, endMs: 155000, bass: 0.7, mid: 0.55, high: 0.5 }, // Bridge / Shy Glizzy
  { startMs: 155000, endMs: 185000, bass: 0.88, mid: 0.78, high: 0.62 }, // Final chorus
  { startMs: 185000, endMs: 210000, bass: 0.45, mid: 0.3, high: 0.2 }, // Outro fadeout
];

function getSectionAt(timeMs: number) {
  return sections.find(s => timeMs >= s.startMs && timeMs < s.endMs) ?? sections[sections.length - 1];
}

// Generate the full beat timeline
function generateTimeline(): BeatEvent[] {
  const events: BeatEvent[] = [];
  const totalMs = 210000; // 3:30 song length
  let beatCount = 0;

  for (let t = 0; t <= totalMs; t += BEAT_MS) {
    const section = getSectionAt(t);
    const isDownbeat = beatCount % 4 === 0;

    // Add subtle variation so it doesn't feel robotic
    const variation = (Math.random() - 0.5) * 0.08;
    const bassBoost = isDownbeat ? 0.15 : 0;

    events.push({
      timeMs: t,
      bass: Math.min(1, Math.max(0, section.bass + variation + bassBoost)),
      mid: Math.min(1, Math.max(0, section.mid + variation * 0.5)),
      high: Math.min(1, Math.max(0, section.high + variation * 0.3)),
      isBeat: isDownbeat,
    });

    beatCount++;
  }

  return events;
}

export const CREW_TIMELINE = generateTimeline();

// Interpolate energy at any given ms timestamp
export function getEnergyAt(timeMs: number): { bass: number; mid: number; high: number; isBeat: boolean } {
  if (CREW_TIMELINE.length === 0) return { bass: 0, mid: 0, high: 0, isBeat: false };

  // Find surrounding beats
  let prev = CREW_TIMELINE[0];
  let next = CREW_TIMELINE[CREW_TIMELINE.length - 1];

  for (let i = 0; i < CREW_TIMELINE.length - 1; i++) {
    if (CREW_TIMELINE[i].timeMs <= timeMs && CREW_TIMELINE[i + 1].timeMs > timeMs) {
      prev = CREW_TIMELINE[i];
      next = CREW_TIMELINE[i + 1];
      break;
    }
  }

  // Linear interpolation between beats
  const range = next.timeMs - prev.timeMs;
  const t = range === 0 ? 0 : (timeMs - prev.timeMs) / range;

  return {
    bass: prev.bass + (next.bass - prev.bass) * t,
    mid: prev.mid + (next.mid - prev.mid) * t,
    high: prev.high + (next.high - prev.high) * t,
    isBeat: prev.isBeat && timeMs - prev.timeMs < 100, // beat "window" of 100ms
  };
}
