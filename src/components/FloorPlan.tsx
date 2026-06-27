'use client';
import { useMemo } from 'react';
import type { PlanType } from '@/data/units';

// ─────────────────────────────────────────────────────────────────────────────
// FLOOR PLAN — clean, branded INDICATIVE presentation plans drawn as inline SVG
// (crisp at any zoom, themeable, accessible — no raster CAD crops). Two levels
// per type, reflecting the real maisonette program read from the architect's
// drawings: a LIVING level (open living/dining/kitchen + guest WC + entrance +
// private veranda facing the valley/sea) and a BEDROOMS level (bedrooms +
// bath(s) + landing). Type A (units 1 & 12) are the larger 3-bed ends.
//
// Walls use the "poché" technique: a stone wall-mass is drawn first, then each
// room is inset on top in paper, so the gaps read as walls. Furniture is light
// line-art. Labels are localised via the `labels` prop.
// ─────────────────────────────────────────────────────────────────────────────

export type FloorLevel = 'ground' | 'first';

export interface FloorPlanLabels {
  living: string; hall: string; wc: string;
  stair: string; landing: string; bath: string; ensuite: string;
  master: string; bed2: string; bed3: string; wardrobe: string;
  veranda: string; indicative: string; north: string;
}

type Furn =
  | { t: 'bed'; x: number; y: number; w: number; h: number }
  | { t: 'sofa'; x: number; y: number; w: number; h: number }
  | { t: 'coffee'; x: number; y: number; w: number; h: number }
  | { t: 'rug'; x: number; y: number; w: number; h: number }
  | { t: 'table'; x: number; y: number; w: number; h: number }
  | { t: 'kitchen'; x: number; y: number; w: number; h: number }
  | { t: 'bath'; x: number; y: number; w: number; h: number }
  | { t: 'shower'; x: number; y: number; w: number; h: number }
  | { t: 'wc'; x: number; y: number; w: number; h: number }
  | { t: 'basin'; x: number; y: number; w: number; h: number }
  | { t: 'wardrobe'; x: number; y: number; w: number; h: number }
  | { t: 'stair'; x: number; y: number; w: number; h: number }
  | { t: 'plant'; x: number; y: number; r: number };

interface Room { name: keyof FloorPlanLabels; x: number; y: number; w: number; h: number; fill?: string; furn?: Furn[]; labelAt?: [number, number] }
interface PlanCfg { vb: [number, number, number, number]; foot: [number, number, number, number]; veranda: [number, number, number, number]; rooms: Room[]; doors?: { x: number; y: number; r: number; a0: number; a1: number }[] }

const C = {
  ink: '#22201C', olive: '#5A5F4A', clay: '#9A5E38', stone: '#D8D1C3',
  wall: '#CFC7B7', paper: '#FCFBF7', soft: '#F1ECE0', line: '#A79E90', veranda: '#EADBCB',
};

// Footprints (dm-ish). Living = open-plan; Bedrooms = cellular.
const PLANS: Record<PlanType, Record<FloorLevel, PlanCfg>> = {
  B: {
    ground: {
      vb: [-16, -16, 326, 420], foot: [0, 0, 260, 320], veranda: [0, 320, 260, 60],
      rooms: [
        { name: 'hall', x: 0, y: 0, w: 100, h: 90, furn: [] },
        { name: 'stair', x: 100, y: 0, w: 80, h: 90, furn: [{ t: 'stair', x: 112, y: 12, w: 56, h: 66 }] },
        { name: 'wc', x: 180, y: 0, w: 80, h: 90, furn: [{ t: 'wc', x: 196, y: 50, w: 22, h: 28 }, { t: 'basin', x: 226, y: 14, w: 24, h: 18 }] },
        { name: 'living', x: 0, y: 90, w: 260, h: 230, fill: C.paper, labelAt: [118, 298], furn: [
          { t: 'rug', x: 22, y: 198, w: 152, h: 104 },
          { t: 'kitchen', x: 8, y: 100, w: 90, h: 26 }, { t: 'sofa', x: 14, y: 150, w: 100, h: 42 },
          { t: 'coffee', x: 34, y: 204, w: 60, h: 24 },
          { t: 'table', x: 150, y: 150, w: 86, h: 70 }, { t: 'plant', x: 234, y: 298, r: 12 },
        ] },
      ],
      doors: [{ x: 100, y: 70, r: 22, a0: 180, a1: 270 }, { x: 50, y: 90, r: 22, a0: 0, a1: 90 }],
    },
    first: {
      vb: [-16, -16, 326, 420], foot: [0, 0, 260, 320], veranda: [0, 320, 260, 60],
      rooms: [
        { name: 'bed2', x: 0, y: 0, w: 130, h: 150, furn: [{ t: 'bed', x: 18, y: 16, w: 78, h: 100 }, { t: 'wardrobe', x: 102, y: 12, w: 18, h: 60 }] },
        { name: 'bath', x: 130, y: 0, w: 130, h: 90, furn: [{ t: 'bath', x: 142, y: 14, w: 70, h: 28 }, { t: 'wc', x: 224, y: 56, w: 22, h: 26 }, { t: 'basin', x: 142, y: 56, w: 26, h: 18 }] },
        { name: 'landing', x: 130, y: 90, w: 130, h: 60, furn: [{ t: 'stair', x: 142, y: 98, w: 56, h: 44 }] },
        { name: 'master', x: 0, y: 150, w: 260, h: 170, fill: C.paper, labelAt: [62, 300], furn: [{ t: 'bed', x: 86, y: 168, w: 92, h: 116 }, { t: 'wardrobe', x: 12, y: 168, w: 18, h: 90 }] },
      ],
      doors: [{ x: 130, y: 130, r: 20, a0: 180, a1: 270 }],
    },
  },
  A: {
    ground: {
      vb: [-16, -16, 366, 444], foot: [0, 0, 300, 344], veranda: [0, 344, 300, 62],
      rooms: [
        { name: 'hall', x: 0, y: 0, w: 110, h: 92 },
        { name: 'stair', x: 110, y: 0, w: 92, h: 92, furn: [{ t: 'stair', x: 124, y: 12, w: 64, h: 68 }] },
        { name: 'wc', x: 202, y: 0, w: 98, h: 92, furn: [{ t: 'wc', x: 218, y: 52, w: 22, h: 28 }, { t: 'basin', x: 250, y: 14, w: 26, h: 18 }] },
        { name: 'living', x: 0, y: 92, w: 300, h: 252, fill: C.paper, labelAt: [138, 322], furn: [
          { t: 'rug', x: 24, y: 220, w: 172, h: 116 },
          { t: 'kitchen', x: 8, y: 102, w: 108, h: 28 }, { t: 'sofa', x: 16, y: 168, w: 116, h: 46 },
          { t: 'coffee', x: 40, y: 224, w: 68, h: 26 },
          { t: 'table', x: 176, y: 160, w: 100, h: 84 }, { t: 'plant', x: 272, y: 322, r: 13 },
        ] },
      ],
      doors: [{ x: 110, y: 70, r: 24, a0: 180, a1: 270 }, { x: 55, y: 92, r: 24, a0: 0, a1: 90 }],
    },
    first: {
      vb: [-16, -16, 366, 444], foot: [0, 0, 300, 344], veranda: [0, 344, 300, 62],
      rooms: [
        { name: 'bed2', x: 0, y: 0, w: 110, h: 150, furn: [{ t: 'bed', x: 14, y: 16, w: 74, h: 96 }] },
        { name: 'bath', x: 110, y: 0, w: 90, h: 90, furn: [{ t: 'shower', x: 122, y: 12, w: 28, h: 28 }, { t: 'wc', x: 166, y: 56, w: 20, h: 26 }, { t: 'basin', x: 122, y: 58, w: 24, h: 18 }] },
        { name: 'bed3', x: 200, y: 0, w: 100, h: 150, furn: [{ t: 'bed', x: 214, y: 16, w: 72, h: 96 }] },
        { name: 'landing', x: 110, y: 90, w: 90, h: 60, furn: [{ t: 'stair', x: 122, y: 98, w: 56, h: 44 }] },
        { name: 'master', x: 0, y: 150, w: 200, h: 194, fill: C.paper, labelAt: [100, 322], furn: [{ t: 'bed', x: 60, y: 168, w: 92, h: 116 }] },
        { name: 'ensuite', x: 200, y: 150, w: 100, h: 92, furn: [{ t: 'bath', x: 214, y: 164, w: 70, h: 26 }, { t: 'wc', x: 264, y: 206, w: 20, h: 26 }] },
        { name: 'wardrobe', x: 200, y: 242, w: 100, h: 102, furn: [{ t: 'wardrobe', x: 214, y: 256, w: 72, h: 16 }] },
      ],
      doors: [{ x: 110, y: 130, r: 20, a0: 180, a1: 270 }],
    },
  },
};

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0); const [x1, y1] = p(a1);
  return `M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`;
}

function Furniture({ f }: { f: Furn }) {
  const s = { stroke: C.line, strokeWidth: 1.3, fill: 'none' } as const;
  switch (f.t) {
    case 'bed':
      return (
        <g {...s}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={4} />
          <rect x={f.x + 2.5} y={f.y + f.h * 0.28} width={f.w - 5} height={f.h * 0.69} rx={3} fill={C.soft} strokeWidth={0.9} />
          <rect x={f.x + 5} y={f.y + 4} width={f.w / 2 - 7} height={f.h * 0.18} rx={3} fill="#FFFFFF" strokeWidth={0.9} />
          <rect x={f.x + f.w / 2 + 2} y={f.y + 4} width={f.w / 2 - 7} height={f.h * 0.18} rx={3} fill="#FFFFFF" strokeWidth={0.9} />
          <line x1={f.x + 2.5} y1={f.y + f.h * 0.6} x2={f.x + f.w - 2.5} y2={f.y + f.h * 0.6} strokeWidth={0.8} />
        </g>
      );
    case 'sofa':
      return (
        <g {...s}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={7} fill={C.soft} />
          <rect x={f.x + 4} y={f.y + 4} width={f.w - 8} height={f.h * 0.42} rx={4} fill="none" />
        </g>
      );
    case 'coffee':
      return <g {...s}><rect x={f.x} y={f.y} width={f.w} height={f.h} rx={5} fill={C.soft} /></g>;
    case 'rug':
      return <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={10} fill="none" stroke={C.line} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="2 5" />;
    case 'table':
      return (
        <g {...s}>
          <rect x={f.x + f.w * 0.16} y={f.y + f.h * 0.2} width={f.w * 0.68} height={f.h * 0.6} rx={4} />
          {[0.12, 0.5, 0.88].map((p, i) => <circle key={`a${i}`} cx={f.x + f.w * p} cy={f.y + 6} r={5} />)}
          {[0.12, 0.5, 0.88].map((p, i) => <circle key={`b${i}`} cx={f.x + f.w * p} cy={f.y + f.h - 6} r={5} />)}
        </g>
      );
    case 'kitchen':
      return (
        <g {...s}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={2} fill={C.soft} />
          <line x1={f.x} y1={f.y + f.h - 4} x2={f.x + f.w} y2={f.y + f.h - 4} strokeWidth={0.8} />
          {/* sink */}
          <rect x={f.x + 8} y={f.y + f.h / 2 - 6} width={18} height={12} rx={3} />
          <circle cx={f.x + 17} cy={f.y + f.h / 2} r={1.3} fill={C.line} stroke="none" />
          {/* hob — 2×2 burners */}
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => <circle key={i} cx={f.x + f.w - 32 + a * 12} cy={f.y + f.h / 2 - 5 + b * 10} r={3} />)}
          {/* tall unit */}
          <rect x={f.x + f.w - 13} y={f.y + 2} width={11} height={f.h - 4} />
        </g>
      );
    case 'bath':
      return <g {...s}><rect x={f.x} y={f.y} width={f.w} height={f.h} rx={9} fill={C.soft} /><rect x={f.x + 3} y={f.y + 3} width={f.w - 6} height={f.h - 6} rx={6} strokeWidth={0.9} /><circle cx={f.x + f.w - 9} cy={f.y + f.h / 2} r={2.4} /></g>;
    case 'shower':
      return <g {...s}><rect x={f.x} y={f.y} width={f.w} height={f.h} rx={2} fill={C.soft} /><line x1={f.x} y1={f.y} x2={f.x + f.w} y2={f.y + f.h} /><line x1={f.x + f.w} y1={f.y} x2={f.x} y2={f.y + f.h} /></g>;
    case 'wc':
      return <g {...s}><rect x={f.x + f.w * 0.2} y={f.y} width={f.w * 0.6} height={f.h * 0.32} rx={2} /><ellipse cx={f.x + f.w / 2} cy={f.y + f.h * 0.62} rx={f.w * 0.42} ry={f.h * 0.34} fill={C.soft} /></g>;
    case 'basin':
      return <g {...s}><rect x={f.x} y={f.y} width={f.w} height={f.h} rx={3} fill={C.soft} /><ellipse cx={f.x + f.w / 2} cy={f.y + f.h * 0.58} rx={f.w * 0.3} ry={f.h * 0.26} /><line x1={f.x + f.w / 2} y1={f.y + 2} x2={f.x + f.w / 2} y2={f.y + 5} /></g>;
    case 'wardrobe':
      return <g {...s}><rect x={f.x} y={f.y} width={f.w} height={f.h} rx={1} fill={C.soft} />{f.w > f.h ? <line x1={f.x} y1={f.y + f.h / 2} x2={f.x + f.w} y2={f.y + f.h / 2} /> : <line x1={f.x + f.w / 2} y1={f.y} x2={f.x + f.w / 2} y2={f.y + f.h} />}</g>;
    case 'stair':
      return (
        <g {...s}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx={1} />
          {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={f.x} y1={f.y + (f.h / 6) * (i + 1)} x2={f.x + f.w} y2={f.y + (f.h / 6) * (i + 1)} strokeWidth={0.9} />)}
          <path d={`M${f.x + f.w / 2},${f.y + f.h - 4} L${f.x + f.w / 2},${f.y + 6}`} markerEnd="url(#fp-arrow)" />
        </g>
      );
    case 'plant':
      return <g><circle cx={f.x} cy={f.y} r={f.r} fill={C.olive} fillOpacity={0.16} stroke={C.olive} strokeOpacity={0.4} strokeWidth={1} /></g>;
  }
}

interface FloorPlanProps {
  planType: PlanType;
  level: FloorLevel;
  area: number; // m² for this level (from units data)
  labels: FloorPlanLabels;
}

export default function FloorPlan({ planType, level, area, labels }: FloorPlanProps) {
  const cfg = PLANS[planType][level];
  const [vx, vy, vw, vh] = cfg.vb;
  const [fx, fy, fw, fh] = cfg.foot;
  const [ex, ey, ew, eh] = cfg.veranda;
  const wallInset = 2;
  const rooms = useMemo(() => cfg.rooms, [cfg]);

  return (
    <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className="w-full h-auto" role="img" aria-label={`${labels.indicative}`} style={{ fontFamily: 'var(--font-outfit)' }}>
      <defs>
        <marker id="fp-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,1 L7,5 L0,9" fill="none" stroke={C.line} strokeWidth="1.4" /></marker>
        <filter id="fp-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={C.ink} floodOpacity="0.12" /></filter>
      </defs>

      {/* Veranda (downhill / view side) */}
      <rect x={ex} y={ey} width={ew} height={eh} rx={3} fill={C.veranda} stroke={C.line} strokeWidth={1.2} />
      <line x1={ex} y1={ey + eh - 6} x2={ex + ew} y2={ey + eh - 6} stroke={C.clay} strokeWidth={1.4} strokeOpacity={0.6} />
      <text x={ex + ew / 2} y={ey + eh / 2 + 4} textAnchor="middle" style={{ fontSize: 12, letterSpacing: '0.08em' }} fill={C.clay}>{labels.veranda}</text>

      {/* Wall mass (poché) + crisp envelope */}
      <rect x={fx} y={fy} width={fw} height={fh} fill={C.wall} filter="url(#fp-shadow)" />

      {/* Rooms (inset → gaps read as walls) */}
      {rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x + wallInset} y={r.y + wallInset} width={r.w - wallInset * 2} height={r.h - wallInset * 2} fill={r.fill || C.paper} />
        </g>
      ))}

      {/* Door swings */}
      {cfg.doors?.map((d, i) => <path key={i} d={arc(d.x, d.y, d.r, d.a0, d.a1)} fill={C.paper} stroke={C.line} strokeWidth={0.9} />)}

      {/* Furniture */}
      {rooms.map((r, i) => (r.furn || []).map((f, j) => <Furniture key={`${i}-${j}`} f={f} />))}

      {/* Crisp outer envelope */}
      <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={C.ink} strokeWidth={2} />

      {/* Room labels — paper backing keeps them legible over furniture */}
      {rooms.map((r, i) => {
        const big = r.name === 'living' || r.name === 'master';
        const [lx, ly] = r.labelAt ?? [r.x + r.w / 2, r.y + r.h / 2];
        const txt = labels[r.name];
        const fs = big ? 13 : 10.5;
        const wpx = txt.length * fs * 0.62 + 14;
        return (
          <g key={`l${i}`} pointerEvents="none">
            <rect x={lx - wpx / 2} y={ly - (fs + 8) / 2} width={wpx} height={fs + 8} rx={(fs + 8) / 2} fill={C.paper} fillOpacity={0.82} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" style={{ fontSize: fs, fontWeight: 500, letterSpacing: '0.03em' }} fill={C.olive}>{txt}</text>
          </g>
        );
      })}

      {/* North arrow (in the right margin, clear of fixtures) + area badge */}
      <g transform={`translate(${fx + fw + 16},${fy + 14})`}>
        <circle r="11" fill={C.paper} stroke={C.stone} strokeWidth="1.1" />
        <path d="M0,-7 L3,2.5 L0,0.5 L-3,2.5 Z" fill={C.clay} />
        <text y="9.5" textAnchor="middle" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 7.5, fontWeight: 600 }} fill={C.ink}>{labels.north}</text>
      </g>
      <g transform={`translate(${fx},${ey + eh + 14})`}>
        <text x="0" y="0" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 600 }} fill={C.ink}>{area} m²</text>
        <text x={fw} y="0" textAnchor="end" style={{ fontSize: 9.5, fontStyle: 'italic' }} fill={C.line}>{labels.indicative}</text>
      </g>
    </svg>
  );
}
