import { useTranslations } from 'next-intl';

export default function SellingPoints() {
  const t = useTranslations();
  const selling = t.raw('selling') as Array<{ icon: string; t: string; d: string }>;

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">01</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('introTitle')}</h2>
        <p className="text-olive text-center max-w-3xl mx-auto mb-16 font-outfit leading-relaxed">{t('introText')}</p>

        <h3 className="font-fraunces text-2xl text-ink text-center mb-10">{t('sellingTitle')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selling.map((item, i) => (
            <div key={i} className="bg-paper border border-line rounded-lg p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-fraunces text-lg text-ink mb-2">{item.t}</h4>
              <p className="text-olive text-sm font-outfit leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
