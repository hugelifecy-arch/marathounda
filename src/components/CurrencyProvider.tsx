'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocale } from 'next-intl';

// Static fallback FX table (1 EUR = X). Update or wire to a live FX API if needed.
export const FX = { EUR: 1, USD: 1.08, GBP: 0.86, RUB: 98, CNY: 7.8, ILS: 3.9 } as const;
export type Currency = keyof typeof FX;
export const CURRENCIES = Object.keys(FX) as Currency[];

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format an amount given in EUR into the active currency. */
  format: (eur: number) => string;
}

const Context = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Format numbers for the active site locale so grouping/symbol placement is
  // correct and deterministic across SSR and client (avoids a hydration
  // mismatch from Intl falling back to the runtime default locale).
  const locale = useLocale();
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  useEffect(() => {
    const saved = window.localStorage.getItem('currency');
    if (saved && saved in FX) setCurrencyState(saved as Currency);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { window.localStorage.setItem('currency', c); } catch { /* ignore */ }
  };

  const format = (eur: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(eur * FX[currency]);

  return <Context.Provider value={{ currency, setCurrency, format }}>{children}</Context.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
