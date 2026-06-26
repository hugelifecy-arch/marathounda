'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const GALLERY_KEYS = ['01','02','03','04','05','06','07','08','09','10','11','12'];

export default function Gallery() {
  const t = useTranslations();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => i !== null ? (i - 1 + GALLERY_KEYS.length) % GALLERY_KEYS.length : null);
  const next = () => setLightbox((i) => i !== null ? (i + 1) % GALLERY_KEYS.length : null);

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-clay text-sm font-outfit tracking-widest uppercase">03</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('galleryTitle')}</h2>
        <p className="text-olive text-center mb-12">{t('gallerySub')}</p>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {GALLERY_KEYS.map((key, i) => (
            <div key={key} onClick={() => setLightbox(i)} className="relative aspect-video cursor-pointer overflow-hidden rounded-lg group break-inside-avoid">
              <Image src={`/renders/render-${key}.jpg`} alt={`Terra Something render ${key}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <Image src={`/renders/render-${GALLERY_KEYS[lightbox]}.jpg`} alt={`Render ${lightbox + 1}`} fill className="object-contain" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={prev} className="text-paper text-2xl px-4 py-2 hover:text-gold transition-colors">&#8249;</button>
              <span className="text-paper/60 text-sm font-outfit">{lightbox + 1} / {GALLERY_KEYS.length}</span>
              <button onClick={next} className="text-paper text-2xl px-4 py-2 hover:text-gold transition-colors">&#8250;</button>
            </div>
          </div>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-paper text-3xl hover:text-gold transition-colors">&#x2715;</button>
        </div>
      )}
    </div>
  );
}
