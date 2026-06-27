'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X } from '@phosphor-icons/react';
import { UNITS, PLANS, type Price, type UnitStatus } from '@/data/units';
import { useCurrency } from '@/components/CurrencyProvider';
import { useFocusTrap } from '@/components/useFocusTrap';
import SitePlan from '@/components/SitePlan';

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
  const [floor, setFloor] = useState<'ground' | 'first'>('ground');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [beds, setBeds] = useState<BedFilter>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, lightbox !== null);
  const unit = selected !== null ? UNITS.find((u) => u.id === selected) : null;

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
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

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
            onSelect={(id) => { setSelected(selected === id ? null : id); setFloor('ground'); }}
            statusLabel={statusLabel}
            unitLabel={t('unit')}
            twoBed={t('twoBed')}
            threeBed={t('threeBed')}
          />
        </div>
        <p className="text-center text-xs text-olive italic mb-8 font-outfit">{t('sitePlanNote')}</p>

        <div className="flex flex-wrap gap-4 justify-center mb-12 text-sm font-outfit">
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-sage border-2 border-sage inline-block" />{t('available')}</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-limestone border-2 border-dashed border-clay inline-block" />{t('reserved')}</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-olive inline-block line-through" />{t('sold')}</span>
          <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded ring-1 ring-ink/30 inline-block" />{t('threeBed')}</span>
        </div>

        {unit && (
          <div ref={panelRef} className="bg-limestone border border-line rounded-xl overflow-hidden max-w-4xl mx-auto scroll-mt-24">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-video md:aspect-auto min-h-64">
                <Image
                  src={`/renders/render-${unit.renderKey}.jpg`}
                  alt={`${t('unit')} ${unit.id} — ${unit.type}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-fraunces text-2xl text-ink mb-1">{t('unit')} {unit.id}</h3>
                <p className="text-accentText font-outfit mb-4">{unit.type}</p>
                <div className="space-y-2 text-sm font-outfit mb-6">
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('bedrooms')}</span><span className="font-medium tnum">{unit.beds}</span></div>
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('internal')}</span><span className="font-medium tnum">{unit.internal} m²</span></div>
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('verandas')}</span><span className="font-medium tnum">{unit.veranda} m²</span></div>
                  {unit.storage > 0 && <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('storage')}</span><span className="font-medium tnum">{unit.storage} m²</span></div>}
                  <div className="flex justify-between border-b border-line py-1 font-semibold"><span>{t('totalArea')}</span><span className="tnum">{unit.total} m²</span></div>
                  <div className="flex justify-between py-1 font-semibold"><span>{t('priceLabel')}</span><span className="text-accentText">{priceLabel(unit.price)}</span></div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-outfit font-semibold ${STATUS_TONE[unit.status].badge}`}>
                  {statusLabel(unit.status)}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-line">
              <h4 className="font-fraunces text-xl text-ink mb-3">{t('floorPlans')}</h4>
              <div className="flex gap-2 mb-4 font-outfit text-sm">
                {(['ground', 'first'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFloor(f)}
                    className={`px-4 py-3 rounded font-medium transition-colors active:opacity-75 ${
                      floor === f ? 'bg-clayDark text-paper' : 'bg-paper text-olive border border-line hover:bg-line/40'
                    }`}
                  >
                    {f === 'ground' ? t('groundFloor') : t('firstFloor')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setLightbox(PLANS[unit.planType][floor])}
                className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-paper"
              >
                <Image
                  src={PLANS[unit.planType][floor]}
                  alt={`${unit.type} — ${floor === 'ground' ? t('groundFloor') : t('firstFloor')}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </button>
              <p className="text-xs text-olive italic mt-3">{t('planCaption')}</p>
            </div>

            <div className="px-6 pb-6">
              <button onClick={() => enquireAbout(unit.id)} className="block w-full text-center bg-clayDark hover:bg-[#824a2b] active:bg-[#824a2b] text-paper py-3 px-6 rounded font-outfit font-semibold transition-colors">
                {t('enquireUnit')}
              </button>
            </div>
          </div>
        )}

        {lightbox && (
          <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('floorPlans')} className="fixed inset-0 bg-ink/95 z-[60] flex items-center justify-center p-4 outline-none" onClick={() => setLightbox(null)}>
            <div className="relative w-full max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <Image src={lightbox} alt={t('floorPlans')} width={1600} height={1100} className="w-full h-auto object-contain max-h-[85vh]" />
            </div>
            <button onClick={() => setLightbox(null)} aria-label={t('close')} className="absolute top-4 end-4 text-paper p-3 min-w-[44px] min-h-[44px] inline-flex items-center justify-center hover:text-gold active:text-gold transition-colors"><X size={24} aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
