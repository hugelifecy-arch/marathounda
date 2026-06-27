import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';

export default function Location() {
  const t = useTranslations();
  const distances = t.raw('distances') as Array<{ p: string; d: string }>;
  const timeline = t.raw('timeline') as Array<{ phase: string; desc: string; done: boolean }>;

  return (
    <div className="bg-paper py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">04</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('locTitle')}</h2>
        <p className="text-olive text-center mb-12">{t('locSub')}</p>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="rounded-xl overflow-hidden border border-line h-80">
              <iframe
                src="https://maps.google.com/maps?q=34.7925,32.4828&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Marathounda, Paphos"
              />
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=34.7925,32.4828"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-accentText hover:text-ink underline underline-offset-2 font-outfit text-sm font-medium"
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" /> {t('directions')}
            </a>
          </div>
          <div className="space-y-3">
            {distances.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-line last:border-0">
                <span className="text-ink font-outfit">{item.p}</span>
                <span className="text-accentText font-outfit font-medium text-sm tnum">{item.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-fraunces text-2xl text-ink text-center mb-8">{t('timelineTitle')}</h3>
          <div className="flex flex-col md:flex-row gap-0 max-w-6xl mx-auto">
            {timeline.map((step, i) => (
              <div key={i} className="flex-1 relative flex flex-col items-center text-center px-2">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 z-10 ${step.done ? 'bg-sage border-sage text-paper' : 'bg-paper border-line text-olive'}`}>
                  <span className="sr-only">{step.done ? `${t('timelineDone')}: ` : `${t('timelineUpcoming')}: `}</span>
                  <span aria-hidden="true">{step.done ? '✓' : <span className="text-xs">{i + 1}</span>}</span>
                </div>
                {i < timeline.length - 1 && <div className="absolute top-4 left-1/2 w-full h-0.5 bg-line hidden md:block" />}
                <p className="font-outfit font-semibold text-sm text-ink">{step.phase}</p>
                <p className="text-olive text-xs font-outfit mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
