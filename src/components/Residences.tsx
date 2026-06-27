'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X } from '@phosphor-icons/react';
import { UNITS, type Price, type UnitStatus } from '@/data/units';
import { useCurrency } from '@/components/CurrencyProvider';
import { useFocusTrap } from '@/components/useFocusTrap';
import SitePlan from '@/components/SitePlan';
import FloorPlan, { type FloorPlanLabels } from '@/components/FloorPlan';
import { SPECIFICATION, RESERVE_STEPS } from '@/data/residenceContent';

type PanelTab = 'overview' | 'plans' | 'spec' | 'reserve';
const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: 'overview', label: 'tabOverview' },
  { key: 'plans', label: 'tabPlans' },
  { key: 'spec', label: 'tabSpec' },
  { key: 'reserve', label: 'tabReserve' },
];

type BedFilter = 'all' | 2 | 3;

// Per-status tokens for the picker grid + detail badge. Hierarchy is tuned for
// conversion: AVAILABLE is the most prominent (strong fill, solid border),
// reserved/sold are muted. Status is also conveyed without colour — reserved
// uses a DASHED border and sold a line-through — to satisfy WCAG 1.4.1.
const STATUS_TONE: Record<UnitStatus, { sel: string; idle: string; badge: string }> = {
  available: { sel: 'bg-sage text-ink border-sage', idle: 'bg-sage/35 text-ink border-2 border-sage hover:bg-sage/55', badge: 'bg-sage/30 text-ink' },
  reserved: { sel: 'bg-clay text-paper border-2 border-dashed border-clay', idle: 'bg-limestone text-olive border-2 border-dashed border-clay/70 hover:bg-clay/10', badge: 'bg-clay/15 text-accentText' },
  sold: { sel: 'bg-olive text-paper border-olive', idle: 'bg-paper text-olive/70 border-2 border-line hover:bg-line/30', badge: 'bg-olive/15 text-olive' },
};

export default function Residences() {
  const t = useTranslations();
  const { format } = useCurrency();
  const [selected, setSelected] = useState<number | null>(null);
  const [tab, setTab] = useState<PanelTab>('overview');
  const [floor, setFloor] = useState<'ground' | 'first'>('ground');
  const [planZoom, setPlanZoom] = useState(false);
  const [beds, setBeds] = useState<BedFilter>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, planZoom);
  const unit = selected !== null ? UNITS.find((u) => u.id === selected) : null;

  const fpLabels: FloorPlanLabels = {
    living: t('fpLiving'), hall: t('fpHall'), wc: t('fpWc'), stair: t('fpStair'),
    landing: t('fpLanding'), bath: t('fpBath'), ensuite: t('fpEnsuite'), master: t('fpMaster'),
    bed2: t('fpBed2'), bed3: t('fpBed3'), wardrobe: t('fpWardrobe'), veranda: t('fpVeranda'),
    indicative: t('fpIndicative'), north: t('fpNorth'),
  };

  const visible = UNITS.filter(
    (u) => (beds === 'all' || u.beds === beds) && (!availableOnly || u.status === 'available'),
  );

  const statusLabel = (s: UnitStatus) => (s === 'available' ? t('available') : s === 'reserved' ? t('reserved') : t('sold'));
  const priceLabel = (p: Price) => (p === 'POA' ? t('poa') : format(p));

  // Smooth-scroll an element to just below the sticky 4rem header. (Native
  // scrollIntoView ignores scroll-padding-top, so headings get clipped.)
  const scrollToWithOffset = (el: HTMLElement | null) => {
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Carry the chosen residence to the enquiry form, then scroll to it.
  const enquireAbout = (id: number) => {
    window.dispatchEvent(new CustomEvent('enquiry:prefill', { detail: id }));
    scrollToWithOffset(document.getElementById('enquire'));
  };

  // Bring the detail panel into view when a residence is selected.
  useEffect(() => {
    if (selected !== null) scrollToWithOffset(panelRef.current);
  }, [selected]);

  useEffect(() => {
    if (!planZoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlanZoom(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [planZoom]);

  return (
    <div className="bg-paper py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">02</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('resTitle')}</h2>
        <p className="section-intro text-olive text-center mb-12">{t('resSub')}</p>

        <div className="flex flex-wrap gap-2 justify-center mb-8 font-outfit text-sm">
          {([['all', t('showAll')], [2, t('twoBed')], [3, t('threeBed')]] as const).map(([value, label]) => (
            <button
              key={String(value)}
              onClick={() => setBeds(value)}
              aria-pressed={beds === value}
              className={`px-4 py-1.5 rounded-full border transition-colors ${beds === value ? 'bg-ink text-paper border-ink' : 'bg-paper text-olive border-line hover:bg-line/40'}`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setAvailableOnly((v) => !v)}
            aria-pressed={availableOnly}
            className={`px-4 py-1.5 rounded-full border transition-colors ${availableOnly ? 'bg-sage text-paper border-sage' : 'bg-paper text-olive border-line hover:bg-line/40'}`}
          >
            {t('availableOnly')}
          </button>
        </div>

        {visible.length === 0 && (
          <p className="text-olive text-center mb-4 font-outfit">{t('noMatch')}</p>
        )}
        <div className="max-w-3xl mx-auto mb-4 rounded-xl border border-line bg-limestone/50 p-4 sm:p-6">
          <SitePlan
            units={visible}
            selected={selected}
            onSelect={(id) => { setSelected(selected === id ? null : id); setFloor('ground'); setTab('overview'); }}
            statusLabel={statusLabel}
            unitLabel={t('unit')}
            twoBed={t('twoBed')}
            threeBed={t('threeBed')}
            availabilityLabel={t('availability')}
          />
        </div>
        <p className="text-center text-xs text-olive italic mb-12 font-outfit">{t('sitePlanNote')}</p>

        {unit && (
          <div ref={panelRef} className="bg-limestone border border-line rounded-xl overflow-hidden max-w-4xl mx-auto scroll-mt-24">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 pt-6">
              <div>
                <h3 className="font-fraunces text-2xl text-ink">{t('unit')} {unit.id}</h3>
                <p className="text-accentText font-outfit">{unit.type}</p>
              </div>
              <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-outfit font-semibold ${STATUS_TONE[unit.status].badge}`}>
                {statusLabel(unit.status)}
              </div>
            </div>

            {/* Tab bar */}
            <div role="tablist" aria-label={`${t('unit')} ${unit.id}`} className="flex flex-wrap gap-1 px-6 mt-4 border-b border-line">
              {PANEL_TABS.map((tb) => (
                <button
                  key={tb.key}
                  role="tab"
                  aria-selected={tab === tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`px-4 py-3 -mb-px text-sm font-outfit font-medium border-b-2 transition-colors ${tab === tb.key ? 'border-clay text-ink' : 'border-transparent text-olive hover:text-clay'}`}
                >
                  {t(tb.label)}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <div className="p-6">
              {tab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-line">
                    <Image src={`/renders/render-${unit.renderKey}.jpg`} alt={`${t('unit')} ${unit.id} — ${unit.type}`} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="space-y-2 text-sm font-outfit">
                      <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('bedrooms')}</span><span className="font-medium tnum">{unit.beds}</span></div>
                      <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('internal')}</span><span className="font-medium tnum">{unit.internal} m²</span></div>
                      <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('verandas')}</span><span className="font-medium tnum">{unit.veranda} m²</span></div>
                      {unit.storage > 0 && <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('storage')}</span><span className="font-medium tnum">{unit.storage} m²</span></div>}
                      <div className="flex justify-between border-b border-line py-1 font-semibold"><span>{t('totalArea')}</span><span className="tnum">{unit.total} m²</span></div>
                      <div className="flex justify-between py-1 font-semibold"><span>{t('priceLabel')}</span><span className="text-accentText">{priceLabel(unit.price)}</span></div>
                    </div>
                    <a href="#calculator" className="mt-4 inline-flex items-center gap-1 text-accentText hover:text-ink underline underline-offset-2 text-sm font-outfit font-medium">{t('estimateThis')} →</a>
                  </div>
                </div>
              )}

              {tab === 'plans' && (
                <div>
                  <div className="flex gap-2 mb-4 font-outfit text-sm">
                    {(['ground', 'first'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFloor(f)}
                        aria-pressed={floor === f}
                        className={`px-4 py-3 rounded font-medium transition-colors active:opacity-75 ${floor === f ? 'bg-clayDark text-paper' : 'bg-paper text-olive border border-line hover:bg-line/40'}`}
                      >
                        {f === 'ground' ? t('groundFloor') : t('firstFloor')}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPlanZoom(true)} aria-label={`${t('floorPlans')} — ${floor === 'ground' ? t('groundFloor') : t('firstFloor')}`} className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-paper p-4 sm:p-6">
                    <FloorPlan planType={unit.planType} level={floor} area={floor === 'ground' ? unit.gf : unit.ff} labels={fpLabels} />
                  </button>
                  <p className="text-xs text-olive italic mt-3">{t('planCaption')}</p>
                </div>
              )}

              {tab === 'spec' && (
                <div>
                  <div className="space-y-6">
                    {SPECIFICATION.map((group) => (
                      <div key={group.title}>
                        <h4 className="font-fraunces text-lg text-ink mb-2">{group.title}</h4>
                        <div className="text-sm font-outfit">
                          {group.rows.map((r) => (
                            <div key={r.label} className="flex justify-between gap-6 border-b border-line py-1.5">
                              <span className="text-olive shrink-0">{r.label}</span>
                              <span className="text-ink text-right">{r.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-olive italic mt-4">{t('specCaption')}</p>
                </div>
              )}

              {tab === 'reserve' && (
                <div>
                  <ol className="space-y-4">
                    {RESERVE_STEPS.map((s, i) => (
                      <li key={i} className="flex gap-4">
                        <span aria-hidden="true" className="shrink-0 w-8 h-8 rounded-full bg-clayDark text-paper inline-flex items-center justify-center font-fraunces font-semibold tnum">{i + 1}</span>
                        <div>
                          <p className="font-outfit font-semibold text-ink">{s.title}</p>
                          <p className="text-sm text-olive font-outfit leading-relaxed">{s.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs text-olive italic mt-4">{t('reserveCaption')}</p>
                </div>
              )}
            </div>

            {/* Persistent CTA */}
            <div className="px-6 pb-6 pt-2 border-t border-line">
              <button onClick={() => enquireAbout(unit.id)} className="block w-full text-center bg-clayDark hover:bg-[#824a2b] active:bg-[#824a2b] text-paper py-3 px-6 rounded font-outfit font-semibold transition-colors">
                {t('enquireUnit')}
              </button>
            </div>
          </div>
        )}

        {planZoom && unit && (
          <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${t('floorPlans')} — ${t('unit')} ${unit.id}`} className="fixed inset-0 bg-ink/95 z-[60] flex items-center justify-center p-4 sm:p-8 outline-none" onClick={() => setPlanZoom(false)}>
            <div className="relative w-full max-w-3xl max-h-[88vh] overflow-auto rounded-xl bg-paper p-6 sm:p-10" onClick={(e) => e.stopPropagation()}>
              <p className="font-fraunces text-xl text-ink mb-1">{t('unit')} {unit.id} — {floor === 'ground' ? t('groundFloor') : t('firstFloor')}</p>
              <p className="text-sm text-olive font-outfit mb-4">{unit.type}</p>
              <FloorPlan planType={unit.planType} level={floor} area={floor === 'ground' ? unit.gf : unit.ff} labels={fpLabels} />
            </div>
            <button onClick={() => setPlanZoom(false)} aria-label={t('close')} className="absolute top-4 end-4 text-paper p-3 min-w-[44px] min-h-[44px] inline-flex items-center justify-center hover:text-gold active:text-gold transition-colors"><X size={24} aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
