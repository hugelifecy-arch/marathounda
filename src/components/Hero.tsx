'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

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

  return (
    <div
      className="relative h-screen min-h-[600px] overflow-hidden"
      aria-roledescription="carousel"
      aria-label={t('heroTitle')}
    >
      {HERO_RENDERS.map((key, i) => (
        <div
          key={key}
          className={`absolute inset-0 transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          aria-roledescription="slide"
          aria-hidden={i !== slide}
        >
          <Image src={`/renders/render-${key}.jpg`} alt={`Terra Something maisonettes in Marathounda, Paphos — exterior view ${i + 1}`} fill className="object-cover" priority={i === 0} />
        </div>
      ))}
      {/* Base gradient for overall legibility + a centred radial scrim so the
          headline stays readable over the brightest (sky / white façade) areas. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/40 to-ink/80" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_44%,rgba(26,24,20,0.5),transparent_75%)]" />

      {/* Screen-reader announcement of the current slide. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {t('heroTitle')} — image {slide + 1} of {HERO_RENDERS.length}
      </span>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pb-28">
        <p className="text-gold text-sm font-outfit tracking-widest uppercase mb-4">{t('heroTag')}</p>
        <h1 className="font-fraunces text-5xl md:text-7xl text-paper font-semibold mb-6">{t('heroTitle')}</h1>
        <p className="font-outfit text-paper/90 text-lg md:text-xl max-w-2xl mb-10">{t('heroSub')}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#residences" className="bg-clayDark hover:bg-[#824a2b] active:bg-[#824a2b] text-paper px-8 py-3 rounded font-outfit font-semibold transition-colors">{t('heroCta')}</a>
          <a href="#enquire" className="border border-paper text-paper hover:bg-paper/10 active:bg-paper/20 px-8 py-3 rounded font-outfit font-medium transition-colors">{t('heroCta2')}</a>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 z-10" role="group" aria-label={t('heroTitle')}>
        {HERO_RENDERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === slide ? 'true' : undefined}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <span className={`block h-2 rounded-full transition-all ${i === slide ? 'bg-gold w-6' : 'bg-paper/60 w-2'}`} />
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-clayDark text-paper py-3 z-10">
        <p className="text-center text-sm font-semibold font-outfit">{t('availLabel')}</p>
      </div>
    </div>
  );
}
