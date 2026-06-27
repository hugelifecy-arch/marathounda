'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { useCurrency, CURRENCIES } from '@/components/CurrencyProvider';

// Eurobank Cyprus Bank Housing Base Rate (BHBR) = Euribor 3M + 1.50% spread.
// 3.90% as published 15 Jun 2026 — keep in sync with
// https://www.eurobank.cy/en/personal/calculators/real-estate
const EUROBANK_BHBR = 3.9;
const EUROBANK_CALC_URL = 'https://www.eurobank.cy/en/personal/calculators/real-estate';

export default function Calculator() {
  const t = useTranslations();
  const { currency, setCurrency, format } = useCurrency();
  const [price, setPrice] = useState(180000);
  const [deposit, setDeposit] = useState(30);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(EUROBANK_BHBR);

  const { monthly, loan } = useMemo(() => {
    const loan = price * (1 - deposit / 100);
    const r = rate / 100 / 12;
    const n = term * 12;
    const monthly = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { monthly, loan };
  }, [price, deposit, term, rate]);

  const fmt = (v: number) => format(v);

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
              { id: 'price', label: t('price'), value: price, min: 90000, max: 300000, step: 5000, set: setPrice, fmt: (v: number) => `€${v.toLocaleString()}` },
              { id: 'deposit', label: t('deposit'), value: deposit, min: 20, max: 50, step: 5, set: setDeposit, fmt: (v: number) => `${v}%` },
              { id: 'term', label: t('term'), value: term, min: 5, max: 30, step: 1, set: setTerm, fmt: (v: number) => `${v} yr` },
              { id: 'rate', label: t('rate'), value: rate, min: 2, max: 6, step: 0.1, set: setRate, fmt: (v: number) => `${v.toFixed(1)}%` },
            ].map(({ id, label, value, min, max, step, set, fmt: fmtLocal }) => (
              <div key={id}>
                <div className="flex justify-between mb-2">
                  <label htmlFor={`calc-${id}`} className="text-paper/80 text-sm font-outfit">{label}</label>
                  <span className="text-gold text-sm font-outfit font-medium">{fmtLocal(value)}</span>
                </div>
                <input id={`calc-${id}`} type="range" min={min} max={max} step={step} value={value}
                  aria-valuetext={fmtLocal(value)}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-1 bg-paper/20 rounded accent-clay cursor-pointer" />
              </div>
            ))}
          </div>

          <div className="bg-darker rounded-xl p-6 flex flex-col justify-center">
            <div className="flex justify-end mb-6 gap-2 flex-wrap">
              {CURRENCIES.map((c) => (
                <button key={c} onClick={() => setCurrency(c)} aria-pressed={c === currency} className={`text-xs px-3 py-2 min-h-[44px] inline-flex items-center rounded font-outfit transition-colors ${c === currency ? 'bg-clayDark text-paper font-semibold' : 'text-paper/70 hover:text-paper'}`}>{c}</button>
              ))}
            </div>
            <div className="text-center mb-6" aria-live="polite">
              <p className="text-paper/60 text-sm font-outfit mb-2">{t('monthly')}</p>
              <p className="font-fraunces text-5xl text-gold tnum">{fmt(monthly)}</p>
              <p className="text-paper/70 text-xs font-outfit mt-2">/mo</p>
            </div>
            <div className="border-t border-paper/10 pt-4">
              <div className="flex justify-between text-sm font-outfit">
                <span className="text-paper/70">{t('loanAmount')}</span>
                <span className="text-paper tnum">{fmt(loan)}</span>
              </div>
            </div>
            <p className="text-onDarkMuted text-sm font-outfit mt-6 leading-relaxed">{t('calcNote')}</p>
            <a
              href={EUROBANK_CALC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-gold text-xs font-outfit underline underline-offset-2 hover:text-paper transition-colors"
            >
              {t('eurobankLink')} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
