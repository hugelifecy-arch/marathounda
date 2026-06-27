'use client';
import { UNITS, type Unit, type UnitStatus } from '@/data/units';

// Stylized, indicative site plan (not to scale) used to SELECT a residence.
// Faithful to the real arrangement: a two-level terrace — lower row (units
// 1–7, with 1 a 3-bed end) and upper row (units 8–12, with 12 a 3-bed end),
// stepping up the slope toward the western sunset/sea views. Exact areas live
// in the unit panel. Built so a commissioned aerial render can replace the
// SVG base later behind the same hotspot/selection layer.

const LOWER = [1, 2, 3, 4, 5, 6, 7];
const UPPER = [8, 9, 10, 11, 12];

// Per-status fills (kept in sync with the unit panel). Available is the most
// prominent; reserved/sold are muted. Status is ALSO conveyed without colour
// (reserved = dashed stroke, sold = strikethrough line) for WCAG 1.4.1.
const FILL: Record<UnitStatus, string> = {
  available: '#7C8868', // sage
  reserved: '#F4F1EA', // limestone (muted)
  sold: '#E3DDD0', // line (muted)
};
const STROKE: Record<UnitStatus, string> = {
  available: '#5A5F4A',
  reserved: '#B5764D',
  sold: '#9A938A',
};

type Box = { x: number; y: number; w: number; h: number };

// Lay out a row of unit ids evenly across [x0, x1] at vertical position y.
function layoutRow(ids: number[], x0: number, x1: number, y: number, h: number, gap: number): Record<number, Box> {
  const n = ids.length;
  const w = (x1 - x0 - gap * (n - 1)) / n;
  const out: Record<number, Box> = {};
  ids.forEach((id, i) => {
    out[id] = { x: x0 + i * (w + gap), y, w, h };
  });
  return out;
}

const BOXES: Record<number, Box> = {
  // Upper terrace (set back, toward the views) — 5 units
  ...layoutRow(UPPER, 150, 712, 64, 92, 10),
  // Lower terrace — 7 units
  ...layoutRow(LOWER, 48, 712, 214, 104, 10),
};

interface SitePlanProps {
  units: Unit[]; // filtered/visible units (others are dimmed, not hidden)
  selected: number | null;
  onSelect: (id: number) => void;
  statusLabel: (s: UnitStatus) => string;
  unitLabel: string; // t('unit')
  twoBed: string;
  threeBed: string;
}

export default function SitePlan({ units, selected, onSelect, statusLabel, unitLabel, twoBed, threeBed }: SitePlanProps) {
  const visibleIds = new Set(units.map((u) => u.id));

  return (
    <svg
      viewBox="0 0 760 360"
      className="w-full h-auto select-none"
      role="group"
      aria-label="Site plan — select a residence"
    >
      {/* Orientation + context annotations */}
      <text x="20" y="150" className="fill-olive" style={{ fontSize: 11, fontFamily: 'var(--font-outfit)' }} transform="rotate(-90 20 150)">
        ◀ Sunset &amp; sea views (west)
      </text>
      <text x="735" y="330" textAnchor="end" className="fill-olive" style={{ fontSize: 11, fontFamily: 'var(--font-outfit)' }}>
        Village access ▶
      </text>
      <g aria-hidden="true" className="fill-olive" style={{ fontSize: 10, fontFamily: 'var(--font-outfit)' }}>
        <text x="48" y="44">Upper terrace</text>
        <text x="48" y="198">Lower terrace</text>
      </g>

      {UNITS.map((u) => {
        const b = BOXES[u.id];
        if (!b) return null;
        const isSel = selected === u.id;
        const isDim = !visibleIds.has(u.id);
        const isEnd = u.beds === 3;
        return (
          <g
            key={u.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${unitLabel} ${u.id}, ${u.beds === 3 ? threeBed : twoBed}, ${statusLabel(u.status)}`}
            onClick={() => onSelect(u.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(u.id); }
            }}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-clay [&:focus-visible>rect]:[stroke-width:3px]"
            style={{ opacity: isDim ? 0.3 : 1, transition: 'opacity 150ms' }}
          >
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={6}
              fill={isSel ? '#B5764D' : FILL[u.status]}
              stroke={isSel ? '#9A5E38' : STROKE[u.status]}
              strokeWidth={isSel || isEnd ? 2.5 : 1.5}
              strokeDasharray={u.status === 'reserved' ? '5 4' : undefined}
              className="transition-colors"
            />
            {/* end-unit marker */}
            {isEnd && (
              <rect x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8} rx={4} fill="none" stroke={isSel ? '#F4F1EA' : '#22201C'} strokeOpacity={0.25} strokeWidth={1} />
            )}
            <text
              x={b.x + b.w / 2}
              y={b.y + b.h / 2 - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20, fontFamily: 'var(--font-fraunces)', fontWeight: 600 }}
              fill={isSel || u.status === 'available' ? (isSel ? '#FFFFFF' : '#22201C') : '#5A5F4A'}
            >
              {u.id}
            </text>
            <text
              x={b.x + b.w / 2}
              y={b.y + b.h / 2 + 16}
              textAnchor="middle"
              style={{ fontSize: 10, fontFamily: 'var(--font-outfit)' }}
              fill={isSel ? '#F4F1EA' : '#5A5F4A'}
            >
              {u.beds}bd
            </text>
            {/* sold strikethrough (non-colour cue) */}
            {u.status === 'sold' && (
              <line x1={b.x + 8} y1={b.y + b.h - 10} x2={b.x + b.w - 8} y2={b.y + 10} stroke="#5A5F4A" strokeWidth={1.5} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
