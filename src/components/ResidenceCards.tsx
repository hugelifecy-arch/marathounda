'use client';
import Image from 'next/image';
import { ArrowRight } from '@phosphor-icons/react';
import { type Unit, type UnitStatus } from '@/data/units';

// Imagery-led residence selector (INEX-style): each residence is a card fronted
// by its photorealistic render, with number / type / area / status, opening the
// detail panel on click. Replaces the flat vector site plan as the primary
// selector. Status is conveyed without colour (dashed = reserved, struck = sold)
// and every card is a real button with keyboard + ARIA support.

interface CardLabels {
  unit: string;
  beds2: string;
  beds3: string;
  available: string;
  reserved: string;
  sold: string;
  view: string;
}

const STATUS: Record<UnitStatus, { dot: string; pill: string; text: string }> = {
  available: { dot: 'bg-sage', pill: 'bg-sage/90 text-ink', text: 'available' },
  reserved: { dot: 'bg-clay', pill: 'bg-paper/90 text-accentText border border-dashed border-clay', text: 'reserved' },
  sold: { dot: 'bg-olive', pill: 'bg-ink/70 text-paper line-through', text: 'sold' },
};

interface Props {
  units: Unit[]; // all units (always rendered; non-matching are dimmed)
  visibleIds: Set<number>;
  selected: number | null;
  onSelect: (id: number) => void;
  statusLabel: (s: UnitStatus) => string;
  labels: CardLabels;
}

export default function ResidenceCards({ units, visibleIds, selected, onSelect, statusLabel, labels }: Props) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
      {units.map((u) => {
        const isSel = selected === u.id;
        const dim = !visibleIds.has(u.id);
        const tone = STATUS[u.status];
        const typeLabel = u.beds === 3 ? labels.beds3 : labels.beds2;
        return (
          <li key={u.id} className={dim ? 'opacity-45 saturate-[0.6] transition-all duration-300' : 'transition-all duration-300'}>
            <button
              type="button"
              onClick={() => onSelect(u.id)}
              aria-pressed={isSel}
              aria-label={`${labels.unit} ${u.id}, ${typeLabel}, ${u.internal} m², ${statusLabel(u.status)}`}
              className={`group relative block w-full text-start overflow-hidden rounded-2xl bg-ink ring-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                isSel ? 'ring-2 ring-clay shadow-xl' : 'ring-line/60 hover:ring-clay/60 hover:shadow-lg'
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={`/renders/render-${u.renderKey}.jpg`}
                  alt={`${labels.unit} ${u.id} — ${typeLabel}`}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/10" />

                {/* Status pill */}
                <span className={`absolute top-3 end-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-outfit font-semibold tracking-wide ${tone.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} ${u.status === 'sold' ? 'no-underline' : ''}`} aria-hidden="true" />
                  <span className={u.status === 'sold' ? 'line-through' : ''}>{statusLabel(u.status)}</span>
                </span>

                {/* Number + meta */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-paper/70 text-[11px] font-outfit uppercase tracking-[0.18em] mb-0.5">{labels.unit}</p>
                    <p className="font-fraunces text-3xl leading-none text-paper">{u.id}</p>
                    <p className="text-paper/85 text-sm font-outfit mt-1.5">{typeLabel}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="font-fraunces text-xl text-paper tnum leading-none">{u.internal}<span className="text-sm"> m²</span></p>
                    <span className="mt-2 inline-flex items-center gap-1 text-paper/0 group-hover:text-gold text-xs font-outfit font-medium transition-colors duration-300">
                      {labels.view} <ArrowRight size={13} weight="bold" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                {/* 3-bed accent */}
                {u.beds === 3 && (
                  <span className="absolute top-3 start-3 rounded-full bg-clayDark/90 text-paper px-2 py-0.5 text-[10px] font-outfit font-semibold tracking-wide">
                    {labels.beds3}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
