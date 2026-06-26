'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { UNITS } from '@/data/units';

const HERO_RENDERS = ['01', '12', '04', '09'];

export default function Hero() {
  const t = useTranslations();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // Don't auto-advance for users who prefer reduced motion.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_RENDERS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const availableCount = UNITS.filter((u) => u.status === 'available').length;

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      {HERO_RENDERS.map((key, i) => (
        <div key={key} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={`/renders/render-${key}.jpg`} alt={`Terra Something maisonettes in Marathounda, Paphos — exterior view ${i + 1}`} fill className="object-cover" priority={i === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <p className="text-gold text-sm font-outfit tracking-widest uppercase mb-4">{t('heroTag')}</p>
        <h1 className="font-fraunces text-5xl md:text-7xl text-paper font-semibold mb-6">{t('heroTitle')}</h1>
        <p className="font-outfit text-paper/80 text-lg md:text-xl max-w-2xl mb-10">{t('heroSub')}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#residences" className="bg-clay hover:bg-clayDark text-paper px-8 py-3 rounded font-outfit font-medium transition-colors">{t('heroCta')}</a>
          <a href="#enquire" className="border border-paper text-paper hover:bg-paper/10 px-8 py-3 rounded font-outfit font-medium transition-colors">{t('heroCta2')}</a>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10">
        {HERO_RENDERS.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === slide} className={`h-2 rounded-full transition-all ${i === slide ? 'bg-gold w-6' : 'bg-paper/50 w-2'}`} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-clay/90 text-paper py-3 z-10">
        <p className="text-center text-sm font-outfit">{availableCount} {t('availLabel')}</p>
      </div>
    </div>
  );
}
