'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useFocusTrap } from '@/components/useFocusTrap';

const GALLERY_KEYS = ['01','02','03','04','05','06','07','08','09','10','11','12'];

export default function Gallery() {
  const t = useTranslations();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, lightbox !== null);

  const prev = useCallback(() => setLightbox((i) => i !== null ? (i - 1 + GALLERY_KEYS.length) % GALLERY_KEYS.length : null), []);
  const next = useCallback(() => setLightbox((i) => i !== null ? (i + 1) % GALLERY_KEYS.length : null), []);
  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, prev, next]);

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">03</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('galleryTitle')}</h2>
        <p className="section-intro text-olive text-center mb-12">{t('gallerySub')}</p>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>button]:mb-3">
          {GALLERY_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => setLightbox(i)}
              aria-label={`${t('galleryTitle')} — ${i + 1} / ${GALLERY_KEYS.length}`}
              className="relative block w-full cursor-pointer overflow-hidden rounded-lg group break-inside-avoid focus:outline-none focus:ring-2 focus:ring-clay"
            >
              <Image
                src={`/renders/render-${key}.jpg`}
                alt={`Terra Something — Marathounda residence exterior render ${i + 1}`}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover [@media(hover:hover)]:group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('galleryTitle')} className="fixed inset-0 bg-ink/95 z-[60] flex items-center justify-center outline-none" onClick={close}>
          <div className="relative w-full max-w-5xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <Image src={`/renders/render-${GALLERY_KEYS[lightbox]}.jpg`} alt={`Terra Something — Marathounda residence exterior render ${lightbox + 1}`} fill className="object-contain" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={prev} aria-label={t('previousImage')} className="text-paper px-4 py-3 hover:text-gold active:text-gold transition-colors"><ChevronLeft className="w-7 h-7" aria-hidden="true" /></button>
              <span aria-live="polite" aria-atomic="true" className="text-paper/70 text-sm font-outfit tnum">{lightbox + 1} / {GALLERY_KEYS.length}</span>
              <button onClick={next} aria-label={t('nextImage')} className="text-paper px-4 py-3 hover:text-gold active:text-gold transition-colors"><ChevronRight className="w-7 h-7" aria-hidden="true" /></button>
            </div>
          </div>
          <button onClick={close} aria-label={t('close')} className="absolute top-4 end-4 text-paper p-3 min-w-[44px] min-h-[44px] inline-flex items-center justify-center hover:text-gold active:text-gold transition-colors"><X className="w-6 h-6" aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}
