'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const FX = { EUR: 1, USD: 1.08, GBP: 0.86, RUB: 98, CNY: 7.8, ILS: 3.9 };
type Currency = keyof typeof FX;

export default function Calculator() {
  const t = useTranslations();
  const [price, setPrice] = useState(180000);
  const [deposit, setDeposit] = useState(30);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(3.06);
  const [currency, setCurrency] = useState<Currency>('EUR');

  const { monthly, loan } = useMemo(() => {
    const loan = price * (1 - deposit / 100);
    const r = rate / 100 / 12;
    const n = term * 12;
    const monthly = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { monthly, loan };
  }, [price, deposit, term, rate]);

  const fmt = (v: number) => new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v * FX[currency]);

  return (
    <div className="bg-dark py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-gold text-sm font-outfit tracking-widest uppercase">05</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-paper text-center mb-4">{t('calcTitle')}</h2>
        <p className="text-paper/60 text-center mb-12">{t('calcSub')}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {[
              { label: t('price'), value: price, min: 90000, max: 300000, step: 5000, set: setPrice, fmt: (v: number) => `€${v.toLocaleString()}` },
              { label: t('deposit'), value: deposit, min: 10, max: 50, step: 5, set: setDeposit, fmt: (v: number) => `${v}%` },
              { label: t('term'), value: term, min: 5, max: 30, step: 1, set: setTerm, fmt: (v: number) => `${v} yr` },
              { label: t('rate'), value: rate, min: 2, max: 6, step: 0.1, set: setRate, fmt: (v: number) => `${v.toFixed(1)}%` },
            ].map(({ label, value, min, max, step, set, fmt: fmtLocal }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <label className="text-paper/80 text-sm font-outfit">{label}</label>
                  <span className="text-gold text-sm font-outfit font-medium">{fmtLocal(value)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-1 bg-paper/20 rounded accent-clay cursor-pointer" />
              </div>
            ))}
          </div>

          <div className="bg-darker rounded-xl p-6 flex flex-col justify-center">
            <div className="flex justify-end mb-6 gap-2 flex-wrap">
              {(Object.keys(FX) as Currency[]).map((c) => (
                <button key={c} onClick={() => setCurrency(c)} className={`text-xs px-2 py-1 rounded font-outfit transition-colors ${c === currency ? 'bg-clay text-paper' : 'text-paper/40 hover:text-paper/80'}`}>{c}</button>
              ))}
            </div>
            <div className="text-center mb-6">
              <p className="text-paper/60 text-sm font-outfit mb-2">{t('monthly')}</p>
              <p className="font-fraunces text-5xl text-gold">{fmt(monthly)}</p>
              <p className="text-paper/40 text-xs font-outfit mt-2">/mo</p>
            </div>
            <div className="border-t border-paper/10 pt-4">
              <div className="flex justify-between text-sm font-outfit">
                <span className="text-paper/60">{t('loanAmount')}</span>
                <span className="text-paper">{fmt(loan)}</span>
              </div>
            </div>
            <p className="text-paper/30 text-xs font-outfit mt-6 leading-relaxed">{t('calcNote')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
