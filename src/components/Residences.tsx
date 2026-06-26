'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { UNITS, PLANS } from '@/data/units';

export default function Residences() {
  const t = useTranslations();
  const [selected, setSelected] = useState<number | null>(null);
  const [floor, setFloor] = useState<'ground' | 'first'>('ground');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const unit = selected !== null ? UNITS.find((u) => u.id === selected) : null;

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
          <span className="text-clay text-sm font-outfit tracking-widest uppercase">02</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('resTitle')}</h2>
        <p className="text-olive text-center mb-12">{t('resSub')}</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => { setSelected(selected === u.id ? null : u.id); setFloor('ground'); }}
              className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-sm font-outfit font-semibold transition-all ${
                u.status === 'available'
                  ? selected === u.id ? 'bg-sage text-paper border-sage' : 'bg-sage/20 text-sage border-sage hover:bg-sage/40'
                  : selected === u.id ? 'bg-clay text-paper border-clay' : 'bg-clay/20 text-clay border-clay hover:bg-clay/40'
              } ${u.beds === 3 ? 'ring-2 ring-offset-1 ring-ink/30' : ''}`}
            >
              <span className="text-lg">{u.id}</span>
              <span className="text-xs opacity-75">{u.beds}bd</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center mb-12 text-sm font-outfit">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-sage inline-block" />{t('available')}</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-clay inline-block" />{t('reserved')}</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded border-2 border-ink/30 inline-block" />{t('threeBed')}</span>
        </div>

        {unit && (
          <div className="bg-limestone border border-line rounded-xl overflow-hidden max-w-4xl mx-auto">
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
                <p className="text-clay font-outfit mb-4">{unit.type}</p>
                <div className="space-y-2 text-sm font-outfit mb-6">
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('bedrooms')}</span><span className="font-medium">{unit.beds}</span></div>
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('internal')}</span><span className="font-medium">{unit.internal} m²</span></div>
                  <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('verandas')}</span><span className="font-medium">{unit.veranda} m²</span></div>
                  {unit.storage > 0 && <div className="flex justify-between border-b border-line py-1"><span className="text-olive">{t('storage')}</span><span className="font-medium">{unit.storage} m²</span></div>}
                  <div className="flex justify-between py-1 font-semibold"><span>{t('totalArea')}</span><span>{unit.total} m²</span></div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-outfit font-semibold ${unit.status === 'available' ? 'bg-sage/20 text-sage' : 'bg-clay/20 text-clay'}`}>
                  {unit.status === 'available' ? t('available') : t('reserved')}
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
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      floor === f ? 'bg-clay text-paper' : 'bg-paper text-olive border border-line hover:bg-line/40'
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
              <a href="#enquire" className="block text-center bg-clay hover:bg-clayDark text-paper py-3 px-6 rounded font-outfit font-medium transition-colors">
                {t('enquireUnit')}
              </a>
            </div>
          </div>
        )}

        {lightbox && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <div className="relative w-full max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <Image src={lightbox} alt={t('floorPlans')} width={1600} height={1100} className="w-full h-auto object-contain max-h-[85vh]" />
            </div>
            <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute top-4 end-4 text-paper text-3xl hover:text-gold transition-colors">&#x2715;</button>
          </div>
        )}
      </div>
    </div>
  );
}
