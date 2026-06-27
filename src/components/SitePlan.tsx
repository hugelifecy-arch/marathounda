'use client';
import { useMemo } from 'react';
import { UNITS, type Unit, type UnitStatus } from '@/data/units';

// ─────────────────────────────────────────────────────────────────────────────
// MASTERPLAN — a designed, atmospheric site plan used to SELECT a residence.
//
// Geometry traced from the architect's site plan (ΕΠΒ sheet 1): the 12
// maisonettes form a SINGLE TERRACED RIBBON that steps diagonally DOWN the
// western edge of a wedge-shaped plot. Each home is a deep, narrow townhouse
// with a private veranda on its downhill (east) side facing the valley/sea; the
// slope rises to the NW; the village lane runs along the uphill flank; the plot
// is planted as olive grove / landscaped gardens. Units 1 & 12 are the wider
// 3-bed ends.
//
// Accessible SVG (a commissioned aerial render can later drop in behind the same
// hotspots). Each home is a real button (role/tabindex/aria + keyboard); status
// is conveyed without colour (dashed = reserved, struck = sold); selecting or
// filtering dims the rest. Depth is baked into explicit shapes so it survives
// any renderer.
// ─────────────────────────────────────────────────────────────────────────────

const VW = 900;
const VH = 600;

type Pt = { x: number; y: number };
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k });
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const r1 = (n: number) => Math.round(n * 10) / 10;
const poly = (pts: Pt[]) => pts.map((p) => `${r1(p.x)},${r1(p.y)}`).join(' ');

// Row axis: U points up-terrace (toward unit 12, NE); P points east / downhill.
const ANG = (-69 * Math.PI) / 180;
const U: Pt = { x: Math.cos(ANG), y: Math.sin(ANG) };
const P: Pt = { x: -U.y, y: U.x };
const W1: Pt = { x: 312, y: 514 }; // west-edge midpoint of unit 1 (south end)
const STEP = 38; // along-row pitch between home centres

interface Block {
  id: number; isEnd: boolean;
  A: Pt; B: Pt; A2: Pt; B2: Pt;   // footprint SW, NW, NE, SE
  ridgeA: Pt; ridgeB: Pt;          // roof ridge (along terrace depth)
  verEast: Pt[]; railA: Pt; railB: Pt;
  pad: Pt[];                       // parking pad (uphill)
  entry: Pt; road: Pt; center: Pt;
}

function buildBlocks(): Block[] {
  return UNITS.map((u, i) => {
    const wmid = add(W1, mul(U, i * STEP));
    const isEnd = u.beds === 3;
    const half = STEP / 2 - (isEnd ? 0.4 : 2.6); // ends wider (less gap), 2-beds gapped
    const bd = isEnd ? 98 : 80;
    const vd = isEnd ? 25 : 22;
    const A = add(wmid, mul(U, -half));
    const B = add(wmid, mul(U, half));
    const A2 = add(A, mul(P, bd));
    const B2 = add(B, mul(P, bd));
    const Av = add(A2, mul(P, vd));
    const Bv = add(B2, mul(P, vd));
    const padIn = add(wmid, mul(P, -12));
    const padA = add(padIn, mul(U, -half * 0.66));
    const padB = add(padIn, mul(U, half * 0.66));
    return {
      id: u.id, isEnd,
      A, B, A2, B2,
      ridgeA: add(A, mul(P, bd * 0.5)), ridgeB: add(B, mul(P, bd * 0.5)),
      verEast: [A2, B2, Bv, Av], railA: Av, railB: Bv,
      pad: [padA, padB, add(padB, mul(P, 7)), add(padA, mul(P, 7))],
      entry: add(wmid, mul(P, -5)),
      road: add(wmid, mul(P, -20)),
      center: add(wmid, mul(P, bd * 0.5)),
    };
  });
}
const BLOCKS = buildBlocks();
const SHADOW: Pt = { x: 4.5, y: 6.5 };

const C = {
  ink: '#22201C', olive: '#5A5F4A', sage: '#7C8868', sageDk: '#5E6B4C',
  riser: '#474D3B', clay: '#B5764D', clayDark: '#9A5E38', limestone: '#F4F1EA',
  stone: '#E3DDD0', road: '#D8D1C3', paper: '#FBFAF6', ground: '#F2EEE2',
};
const FILL: Record<UnitStatus, string> = { available: '#8B9A74', reserved: '#ECDCC9', sold: '#CFC8BB' };
const STROKE: Record<UnitStatus, string> = { available: '#4F5640', reserved: C.clayDark, sold: '#A79E92' };

// Small olive/cypress cluster filling the NW hillside (uphill, behind the homes).
const NW_TREES: { x: number; y: number; r: number }[] = [
  { x: 196, y: 252, r: 8 }, { x: 232, y: 224, r: 6.5 }, { x: 268, y: 250, r: 7.5 },
  { x: 180, y: 320, r: 7 }, { x: 224, y: 300, r: 6 }, { x: 300, y: 214, r: 6.5 },
  { x: 158, y: 388, r: 6.5 }, { x: 206, y: 372, r: 5.5 }, { x: 262, y: 350, r: 7 },
];

// Olive grove — orchard grid in 3 size tiers, lightly jittered, inside a bed.
const GROVE: { x: number; y: number; r: number }[] = (() => {
  const out: { x: number; y: number; r: number }[] = [];
  const anchor: Pt = { x: 556, y: 246 };
  const rowDir: Pt = { x: 0.46, y: 0.89 };
  const colDir: Pt = { x: 0.92, y: -0.14 };
  const jig = [0.35, -0.55, 0.2, -0.3, 0.45, -0.2, 0.5, -0.4];
  const tier = [11.5, 8.5, 13, 9.5, 8, 12];
  for (let rr = 0; rr < 7; rr++) {
    for (let c = 0; c < 5; c++) {
      const j = jig[(rr + c) % jig.length];
      const x = anchor.x + rowDir.x * rr * 31 + colDir.x * c * 35 + j * 9;
      const y = anchor.y + rowDir.y * rr * 31 + colDir.y * c * 35 + j * 7;
      if (x > 812 || y > 540 || x < 474 || y < 150) continue;
      out.push({ x, y, r: tier[(rr * 5 + c) % tier.length] });
    }
  }
  return out;
})();

interface SitePlanProps {
  units: Unit[];
  selected: number | null;
  onSelect: (id: number) => void;
  statusLabel: (s: UnitStatus) => string;
  unitLabel: string;
  twoBed: string;
  threeBed: string;
  availabilityLabel: string;
}

export default function SitePlan({ units, selected, onSelect, statusLabel, unitLabel, twoBed, threeBed, availabilityLabel }: SitePlanProps) {
  const visibleIds = useMemo(() => new Set(units.map((u) => u.id)), [units]);
  const unitById = useMemo(() => new Map(UNITS.map((u) => [u.id, u])), []);
  const roadPath = useMemo(() => {
    const first = BLOCKS[0].road, last = BLOCKS[BLOCKS.length - 1].road;
    const start = { x: 372, y: 560 }; // village access (south)
    const pts = BLOCKS.map((b) => `${r1(b.road.x)},${r1(b.road.y)}`).join(' L');
    return `M${start.x},${start.y} Q${r1(first.x - 6)},${r1(first.y + 22)} ${r1(first.x)},${r1(first.y)} L${pts} L${r1(last.x - 6)},${r1(last.y - 14)}`;
  }, []);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto select-none" role="group" aria-label="Masterplan — select a residence" style={{ fontFamily: 'var(--font-outfit)' }}>
      <defs>
        <radialGradient id="mp-sun" cx="0.22" cy="0.1" r="1.05">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="0.5" stopColor={C.paper} stopOpacity="0.2" />
          <stop offset="1" stopColor={C.stone} stopOpacity="0.26" />
        </radialGradient>
        <linearGradient id="mp-view" x1="0" y1="0" x2="0.9" y2="0.5">
          <stop offset="0" stopColor={C.sage} stopOpacity="0" />
          <stop offset="1" stopColor="#9FB2A2" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="mp-tree" cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#A7B48C" />
          <stop offset="0.7" stopColor={C.sage} />
          <stop offset="1" stopColor={C.sageDk} />
        </radialGradient>
        <filter id="mp-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6" /></filter>
        <filter id="mp-card" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor={C.ink} floodOpacity="0.18" /></filter>
      </defs>

      <rect x="0" y="0" width={VW} height={VH} fill={C.paper} />

      {/* Plot ground plane (wedge) */}
      <polygon points="116,82 474,66 782,150 824,480 452,570 144,444" fill={C.ground} stroke={C.ink} strokeOpacity="0.18" strokeWidth="1.2" />

      {/* NW hillside — stepped terrain bands rising to the slope */}
      <g>
        <path d="M144,444 Q150,300 300,200 Q430,120 474,66 L300,150 Q210,250 200,452 Z" fill={C.sage} fillOpacity="0.14" />
        <path d="M150,300 Q230,210 360,150 Q300,170 250,250 Q210,320 210,400 Z" fill={C.sage} fillOpacity="0.11" />
      </g>
      <g fill="none" stroke={C.sage} strokeOpacity="0.3" strokeWidth="1.2">
        <path d="M150,444 Q156,290 322,180 Q470,96 474,66" />
        <path d="M196,456 Q214,310 396,196 Q470,150 506,120" />
        <path d="M250,474 Q276,344 446,234 Q560,168 588,140" />
      </g>
      {/* dry-stone footpath tracing a contour */}
      <path d="M176,430 Q210,330 300,250 Q380,184 452,150" fill="none" stroke={C.stone} strokeWidth="2" strokeOpacity="0.85" strokeDasharray="1.5 4" strokeLinecap="round" />
      {/* NW olive/cypress cluster */}
      <g>
        {NW_TREES.map((tr, i) => (
          <g key={`nw${i}`} opacity="0.85">
            <ellipse cx={tr.x + 2} cy={tr.y + 2.6} rx={tr.r * 0.95} ry={tr.r * 0.6} fill={C.ink} fillOpacity="0.08" />
            <circle cx={tr.x} cy={tr.y} r={tr.r} fill="url(#mp-tree)" />
          </g>
        ))}
      </g>

      <rect x="0" y="0" width={VW} height={VH} fill="url(#mp-sun)" />

      {/* SE landscaped garden apron + view edge */}
      <path d="M468,404 Q566,420 612,506 L452,570 296,506 Q386,448 468,404 Z" fill={C.sage} fillOpacity="0.16" />
      <path d="M782,150 824,480 452,570 Q710,476 790,300 Q808,212 782,150 Z" fill="url(#mp-view)" />
      {/* valley terracing + horizon cue the verandas face */}
      <g fill="none" stroke={C.sage} strokeOpacity="0.32" strokeWidth="1">
        <path d="M612,536 Q716,500 802,470" />
        <path d="M648,554 Q762,520 816,498" />
      </g>
      <path d="M700,452 Q758,440 814,452" fill="none" stroke={C.stone} strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" />

      {/* Olive grove — soft bed + tiered trees with shadows */}
      <path d="M512,196 Q700,176 800,290 Q820,430 600,512 Q488,486 486,360 Q486,250 512,196 Z" fill={C.sage} fillOpacity="0.12" stroke={C.clay} strokeOpacity="0.18" strokeWidth="1" />
      <g>
        {GROVE.map((tr, i) => (
          <g key={i}>
            <ellipse cx={tr.x + 2.4} cy={tr.y + 3.2} rx={tr.r * 0.95} ry={tr.r * 0.62} fill={C.ink} fillOpacity="0.10" />
            <circle cx={tr.x} cy={tr.y} r={tr.r} fill="url(#mp-tree)" />
          </g>
        ))}
      </g>

      {/* Access road along the uphill (west) flank + parking pads + entrance pin */}
      <path d={roadPath} fill="none" stroke={C.road} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={roadPath} fill="none" stroke={C.paper} strokeWidth="1.6" strokeDasharray="5 9" strokeLinecap="round" />
      <g fill={C.road} stroke={C.stone} strokeWidth="0.75">
        {BLOCKS.map((b) => <polygon key={`pad${b.id}`} points={poly(b.pad)} />)}
      </g>
      <g transform="translate(372,560)">
        <circle r="6.5" fill={C.clay} stroke={C.paper} strokeWidth="1.6" />
        <circle r="2" fill={C.paper} />
      </g>

      {/* Retaining-terrace contour just downhill of the homes */}
      <path d={`M${r1(BLOCKS[0].A2.x + 26)},${r1(BLOCKS[0].A2.y + 24)} Q${r1(BLOCKS[5].A2.x + 56)},${r1(BLOCKS[5].A2.y)} ${r1(BLOCKS[11].B2.x + 30)},${r1(BLOCKS[11].B2.y - 18)}`} fill="none" stroke={C.stone} strokeWidth="2.2" strokeOpacity="0.9" strokeLinecap="round" />

      {/* Home shadows (under everything) */}
      <g filter="url(#mp-blur)" fill={C.ink} fillOpacity="0.2">
        {BLOCKS.map((b) => <polygon key={`sh${b.id}`} points={poly([b.A, b.B, b.B2, b.A2, b.railA].map((p) => add(p, SHADOW)))} />)}
      </g>

      {/* Terrace risers — dark step between consecutive homes (reads as stepping down) */}
      <g fill={C.riser} fillOpacity="0.85">
        {BLOCKS.slice(1).map((b, i) => {
          const prev = BLOCKS[i];
          return <polygon key={`rs${b.id}`} points={poly([prev.B, b.A, b.A2, prev.B2])} />;
        })}
      </g>

      {/* Private verandas (downhill / view side) with balustrade + pergola */}
      <g>
        {BLOCKS.map((b) => {
          const on = visibleIds.has(b.id);
          const p1 = lerp(b.verEast[0], b.verEast[3], 0.5);
          const p2 = lerp(b.verEast[1], b.verEast[2], 0.5);
          return (
            <g key={`v${b.id}`} style={{ opacity: on ? 1 : 0.32 }}>
              <polygon points={poly(b.verEast)} fill={C.clay} fillOpacity={on ? 0.4 : 0.2} stroke={C.clay} strokeOpacity="0.45" strokeWidth="0.75" />
              {/* pergola hint */}
              <line x1={r1(p1.x)} y1={r1(p1.y)} x2={r1(p2.x)} y2={r1(p2.y)} stroke={C.clayDark} strokeWidth="0.6" strokeOpacity="0.4" />
              {/* balustrade */}
              <line x1={r1(b.railA.x)} y1={r1(b.railA.y)} x2={r1(b.railB.x)} y2={r1(b.railB.y)} stroke={C.clayDark} strokeWidth="1.6" />
              <line x1={r1(b.railA.x)} y1={r1(b.railA.y)} x2={r1(b.railB.x)} y2={r1(b.railB.y)} stroke={C.limestone} strokeWidth="0.5" strokeDasharray="1.5 3" />
            </g>
          );
        })}
      </g>

      {/* Homes — interactive hotspots */}
      {BLOCKS.map((b) => {
        const u = unitById.get(b.id)!;
        const isSel = selected === b.id;
        const isDim = !visibleIds.has(b.id);
        const fill = isSel ? C.clay : FILL[u.status];
        const stroke = isSel ? C.clayDark : STROKE[u.status];
        const numFill = isSel ? C.paper : b.isEnd ? C.clayDark : '#1E2417';
        return (
          <g
            key={b.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${unitLabel} ${b.id}, ${u.beds === 3 ? threeBed : twoBed}, ${statusLabel(u.status)}`}
            onClick={() => onSelect(b.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(b.id); } }}
            className="cursor-pointer outline-none [&:focus-visible_.mp-hit]:stroke-clayDark [&:focus-visible_.mp-hit]:[stroke-width:3.5px]"
            style={{ opacity: isDim ? 0.34 : 1, transition: 'opacity 200ms ease' }}
          >
            <polygon className="mp-hit" points={poly([b.A, b.B, b.B2, b.A2])} fill={fill} stroke={stroke} strokeWidth={isSel || b.isEnd ? 2 : 1.1} strokeDasharray={u.status === 'reserved' ? '5 4' : undefined} strokeLinejoin="round" />
            <polygon points={poly([b.ridgeA, b.ridgeB, b.B2, b.A2])} fill={C.ink} fillOpacity={isSel ? 0.1 : 0.13} stroke="none" pointerEvents="none" />
            <line x1={r1(b.ridgeA.x)} y1={r1(b.ridgeA.y)} x2={r1(b.ridgeB.x)} y2={r1(b.ridgeB.y)} stroke={isSel ? C.limestone : C.ink} strokeOpacity={isSel ? 0.5 : 0.3} strokeWidth="1" pointerEvents="none" />
            {/* end-unit (3-bed) accents: clay ring + party-division line + 3-BED tag */}
            {b.isEnd && (
              <>
                <line x1={r1(b.ridgeA.x)} y1={r1(b.ridgeA.y)} x2={r1(lerp(b.A, b.B, 0.5).x)} y2={r1(lerp(b.A, b.B, 0.5).y)} stroke={C.ink} strokeOpacity="0.22" strokeWidth="0.8" pointerEvents="none" />
                <rect x={r1(b.center.x) - 16} y={r1(b.center.y) + 12} width="32" height="11" rx="5.5" fill={C.clayDark} pointerEvents="none" />
                <text x={r1(b.center.x)} y={r1(b.center.y) + 19.5} textAnchor="middle" pointerEvents="none" style={{ fontSize: 7, letterSpacing: '0.08em', fontWeight: 600 }} fill={C.paper}>3-BED</text>
              </>
            )}
            {/* numeral plate — signals clickable, anchors the number */}
            <circle cx={r1(b.center.x)} cy={r1(b.center.y) - (b.isEnd ? 4 : 0)} r={b.isEnd ? 12.5 : 10.5} fill={C.paper} fillOpacity="0.92" stroke={isSel ? C.clayDark : C.ink} strokeOpacity={isSel ? 0.6 : 0.22} strokeWidth={isSel ? 1.6 : 1} pointerEvents="none" />
            <text x={r1(b.center.x)} y={r1(b.center.y) - (b.isEnd ? 4 : 0)} textAnchor="middle" dominantBaseline="central" pointerEvents="none" style={{ fontFamily: 'var(--font-fraunces)', fontSize: b.isEnd ? 17 : 14, fontWeight: 600 }} fill={numFill}>{b.id}</text>
            {u.status === 'sold' && <line x1={r1(b.A.x)} y1={r1(b.A.y)} x2={r1(b.B2.x)} y2={r1(b.B2.y)} stroke={C.olive} strokeWidth="1.4" pointerEvents="none" />}
          </g>
        );
      })}

      {/* Orientation + amenity callouts */}
      <g fill={C.ink}>
        {/* clay compass */}
        <g transform="translate(798,96)">
          <circle r="15" fill={C.paper} stroke={C.stone} strokeWidth="1.2" />
          <path d="M0,-11 L4,2 L0,-1 Z" fill={C.clayDark} />
          <path d="M0,-11 L-4,2 L0,-1 Z" fill={C.clay} fillOpacity="0.6" />
          <text y="12" textAnchor="middle" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 9, fontWeight: 600 }} fill={C.ink}>N</text>
        </g>
        <g style={{ fontSize: 10.5, letterSpacing: '0.16em' }} fillOpacity="0.72">
          <circle cx="612" cy="226" r="1.6" fill={C.sageDk} />
          <text x="624" y="229">OLIVE GROVE &amp; GARDENS</text>
          <text x="250" y="206" textAnchor="middle" transform="rotate(-32 250 206)" fillOpacity="0.85" style={{ fontSize: 9.5 }}>HILLSIDE ↑ NW</text>
          <text x="392" y="560" textAnchor="middle">VILLAGE ACCESS</text>
        </g>
        {/* view callout — focal cue */}
        <g>
          <text x="700" y="500" textAnchor="middle" style={{ fontSize: 12, letterSpacing: '0.18em', fontWeight: 600 }} fill={C.clayDark}>SEA &amp; VALLEY VIEWS</text>
          <line x1="624" y1="504" x2="776" y2="504" stroke={C.clayDark} strokeWidth="0.8" strokeOpacity="0.5" />
          <path d="M708,516 q34,15 70,6" fill="none" stroke={C.clayDark} strokeWidth="1.3" />
          <path d="M778,524 l-9,-3 l5,8 Z" fill={C.clayDark} />
        </g>
        {/* veranda callout */}
        <g style={{ fontSize: 9.5, letterSpacing: '0.04em' }} fill={C.olive}>
          <line x1={r1(BLOCKS[7].railB.x)} y1={r1(BLOCKS[7].railB.y)} x2="560" y2="300" stroke={C.olive} strokeWidth="0.7" strokeOpacity="0.55" />
          <text x="556" y="296" textAnchor="end" fillOpacity="0.85">Private verandas</text>
        </g>
      </g>

      {/* Legend card (localised via props) */}
      <g transform="translate(38,452)">
        <rect x="0" y="0" width="184" height="116" rx="9" fill={C.paper} stroke={C.stone} strokeWidth="1" filter="url(#mp-card)" />
        <text x="15" y="22" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }} fill={C.ink}>{availabilityLabel}</text>
        <g style={{ fontSize: 10.5 }} fill={C.olive}>
          <rect x="15" y="32" width="15" height="15" rx="3" fill="#8B9A74" stroke="#4F5640" strokeWidth="1.5" />
          <text x="38" y="43">{statusLabel('available')}</text>
          <rect x="15" y="53" width="15" height="15" rx="3" fill="#ECDCC9" stroke={C.clayDark} strokeWidth="1.5" strokeDasharray="3 2.5" />
          <text x="38" y="64">{statusLabel('reserved')}</text>
          <rect x="15" y="74" width="15" height="15" rx="3" fill="#CFC8BB" stroke="#A79E92" strokeWidth="1.5" />
          <line x1="16" y1="88" x2="29" y2="75" stroke={C.olive} strokeWidth="1.1" />
          <text x="38" y="85">{statusLabel('sold')}</text>
          <g transform="translate(15,98)">
            <circle cx="7.5" cy="6" r="7.5" fill={C.paper} stroke={C.clayDark} strokeWidth="1.4" />
            <text x="7.5" y="9.2" textAnchor="middle" style={{ fontFamily: 'var(--font-fraunces)', fontSize: 9, fontWeight: 600 }} fill={C.clayDark}>1</text>
            <text x="23" y="10" fill={C.clayDark}>{threeBed}</text>
          </g>
        </g>
      </g>
    </svg>
  );
}
