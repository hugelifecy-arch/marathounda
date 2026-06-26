'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { useCurrency, CURRENCIES } from '@/components/CurrencyProvider';
import Link from 'next/link';

const LOCALE_LABELS: Record<string, string> = { en: 'EN', ru: 'РУ', el: 'ΕΛ', he: 'עב', zh: '中', de: 'DE' };
const NAV_IDS = ['project', 'residences', 'gallery', 'location', 'calculator', 'enquire'];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const curRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const navItems = (t.raw('nav') as string[]);

  // Close the currency / language dropdowns on outside click or Escape.
  useEffect(() => {
    if (!curOpen && !langOpen) return;
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (curRef.current?.contains(target) || langRef.current?.contains(target)) return;
      setCurOpen(false);
      setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCurOpen(false); setLangOpen(false); }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [curOpen, langOpen]);

  // Strip the leading locale segment to get the path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-limestone/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#main" onClick={scrollToTop} aria-label="Terra Something — back to top" className="flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 40 40">
            <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="#B5764D" strokeWidth="1.5" />
            <path d="M8 26 L14 18 L20 24 L26 14 L32 26 Z" fill="#B5764D" opacity="0.85" />
            <circle cx="28" cy="11" r="3" fill="#B5764D" />
            <line x1="8" y1="29" x2="32" y2="29" stroke="#22201C" strokeWidth="1.5" />
          </svg>
          <div style={{ lineHeight: 1 }}>
            <div className="font-fraunces text-lg font-semibold text-ink" style={{ letterSpacing: 0.5 }}>TERRA</div>
            <div className="text-clay font-medium" style={{ fontSize: 9, letterSpacing: 4, marginTop: 1 }}>SOMETHING</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((label, i) => (
            <a key={i} href={`#${NAV_IDS[i]}`} className="text-sm text-olive hover:text-clay transition-colors">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative" ref={curRef}>
            <button onClick={() => { setCurOpen(!curOpen); setLangOpen(false); }} aria-label={t('currencyLabel')} aria-haspopup="menu" aria-expanded={curOpen} className="text-sm text-olive hover:text-clay px-2 py-1 border border-line rounded transition-colors">
              {currency}
            </button>
            {curOpen && (
              <div role="menu" className="absolute end-0 top-full mt-1 bg-paper border border-line rounded shadow-lg z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setCurOpen(false); }}
                    className={`block w-full text-start px-4 py-2 text-sm hover:bg-limestone transition-colors ${c === currency ? 'text-clay font-semibold' : 'text-ink'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={langRef}>
            <button onClick={() => { setLangOpen(!langOpen); setCurOpen(false); }} aria-label={t('languageLabel')} aria-haspopup="menu" aria-expanded={langOpen} className="text-sm text-olive hover:text-clay px-2 py-1 border border-line rounded transition-colors">
              {LOCALE_LABELS[locale]}
            </button>
            {langOpen && (
              <div role="menu" className="absolute end-0 top-full mt-1 bg-paper border border-line rounded shadow-lg z-50">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}${pathWithoutLocale}`}
                    hrefLang={l}
                    lang={l}
                    onClick={() => setLangOpen(false)}
                    aria-current={l === locale ? 'true' : undefined}
                    className={`block w-full text-start px-4 py-2 text-sm hover:bg-limestone transition-colors ${l === locale ? 'text-clay font-semibold' : 'text-ink'}`}
                  >
                    {LOCALE_LABELS[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="lg:hidden text-olive">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-line bg-limestone">
          {navItems.map((label, i) => (
            <a key={i} href={`#${NAV_IDS[i]}`} onClick={() => setMenuOpen(false)} className="block px-6 py-3 text-sm text-olive hover:text-clay border-b border-line last:border-0">{label}</a>
          ))}
        </div>
      )}
    </header>
  );
}
