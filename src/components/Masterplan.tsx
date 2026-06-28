'use client';
import Image from 'next/image';
import { UNITS, type Unit, type UnitStatus } from '@/data/units';

// Photorealistic interactive masterplan (INEX-style): the whole development on a
// real render, with a numbered, status-coded, clickable marker on each of the 12
// homes. Marker positions are tuned to the render (render-02 — the elevated
// valley-side view). Each marker is a real button (keyboard + ARIA); status is
// conveyed without colour (dashed ring = reserved, struck = sold); filtering
// dims non-matching homes. A commissioned aerial can later swap in behind the
// same markers.

// Marker centres as % of the masterplan image (2.5:1 crop of render-02).
// Each marker sits on its villa's stone-clad lower facade; 10–12 on the taller
// right-hand block. Verified by compositing onto the actual image.
const SPOTS: { id: number; x: number; y: number }[] = [
  { id: 1, x: 14, y: 66 }, { id: 2, x: 17, y: 63 }, { id: 3, x: 22, y: 62 }, { id: 4, x: 29, y: 60 },
  { id: 5, x: 36, y: 61 }, { id: 6, x: 41, y: 61 }, { id: 7, x: 43, y: 59 }, { id: 8, x: 48, y: 58 },
  { id: 9, x: 54, y: 60 }, { id: 10, x: 66, y: 47 }, { id: 11, x: 70, y: 47 }, { id: 12, x: 76, y: 46 },
];

const DOT: Record<UnitStatus, string> = {
  available: 'bg-sage border-paper',
  reserved: 'bg-paper border-clay border-dashed text-accentText',
  sold: 'bg-ink/70 border-paper/70 text-paper',
};

interface MasterplanLabels {
  prompt: string;
  unit: string;
  beds2: string;
  beds3: string;
  available: string;
  reserved: string;
}

interface Props {
  visibleIds: Set<number>;
  selected: number | null;
  onSelect: (id: number) => void;
  statusLabel: (s: UnitStatus) => string;
  labels: MasterplanLabels;
}

export default function Masterplan({ visibleIds, selected, onSelect, statusLabel, labels }: Props) {
  const byId = new Map<number, Unit>(UNITS.map((u) => [u.id, u]));
  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl shadow-ink/15 ring-1 ring-line/50">
        <div className="relative aspect-[2.5/1]">
          <Image src="/renders/masterplan.jpg" alt={labels.prompt} fill sizes="(max-width:1280px) 100vw, 1216px" className="object-cover" />
          {/* readability scrim, strongest top where markers sit */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/10 pointer-events-none" />

          {SPOTS.map((s) => {
            const u = byId.get(s.id);
            if (!u) return null;
            const isSel = selected === s.id;
            const dim = !visibleIds.has(s.id);
            const type = u.beds === 3 ? labels.beds3 : labels.beds2;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={isSel}
                aria-label={`${labels.unit} ${s.id}, ${type}, ${statusLabel(u.status)}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 focus-visible:outline-none transition-[opacity] duration-300 ${
                  dim ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-full border-2 font-fraunces font-semibold shadow-md shadow-ink/40 transition-all duration-200 ${DOT[u.status]} ${
                    isSel
                      ? 'w-9 h-9 sm:w-11 sm:h-11 text-base ring-4 ring-clay/45 scale-110 !bg-clay !border-paper !text-paper'
                      : 'w-6 h-6 sm:w-8 sm:h-8 text-[11px] sm:text-sm group-hover:scale-115 group-focus-visible:ring-4 group-focus-visible:ring-clay/50'
                  } ${u.status === 'available' ? 'text-ink' : ''}`}
                >
                  {s.id}
                </span>
                {/* hover/selected name chip */}
                <span
                  className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap rounded-full bg-ink/85 text-paper text-[11px] font-outfit px-2 py-0.5 transition-opacity duration-200 ${
                    isSel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {labels.unit} {s.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* prompt + legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-outfit">
        <span className="text-olive">{labels.prompt}</span>
        <span className="flex items-center gap-2 text-olive"><span className="w-3.5 h-3.5 rounded-full bg-sage border-2 border-paper shadow-sm inline-block" />{labels.available}</span>
        <span className="flex items-center gap-2 text-olive"><span className="w-3.5 h-3.5 rounded-full bg-paper border-2 border-dashed border-clay inline-block" />{labels.reserved}</span>
      </div>
    </div>
  );
}
