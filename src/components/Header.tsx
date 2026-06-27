'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { useCurrency, CURRENCIES } from '@/components/CurrencyProvider';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useFocusTrap } from '@/components/useFocusTrap';
import Logo from '@/components/Logo';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = (t.raw('nav') as string[]);
  const active = useScrollSpy(NAV_IDS);

  // Trap focus inside the mobile menu while open; restore on close.
  useFocusTrap(menuRef, menuOpen);

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

  // Mobile menu: Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
        <a href="#main" onClick={scrollToTop} aria-label={`${t('heroTitle')} — back to top`} className="flex items-center">
          <Logo variant="onLight" />
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((label, i) => (
            <a
              key={i}
              href={`#${NAV_IDS[i]}`}
              aria-current={active === NAV_IDS[i] ? 'location' : undefined}
              className={`text-sm py-2.5 flex items-center transition-colors ${active === NAV_IDS[i] ? 'text-clay font-medium' : 'text-olive hover:text-clay'}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative" ref={curRef}>
            <button onClick={() => { setCurOpen(!curOpen); setLangOpen(false); }} aria-label={t('currencyLabel')} aria-haspopup="listbox" aria-expanded={curOpen} className="text-sm text-olive hover:text-clay px-3 py-2 min-h-[44px] inline-flex items-center border border-line rounded transition-colors">
              {currency}
            </button>
            {curOpen && (
              <div role="listbox" aria-label={t('currencyLabel')} className="absolute end-0 top-full mt-1 bg-paper border border-line rounded shadow-lg z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    role="option"
                    aria-selected={c === currency}
                    onClick={() => { setCurrency(c); setCurOpen(false); }}
                    className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-limestone transition-colors ${c === currency ? 'text-accentText font-semibold' : 'text-ink'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={langRef}>
            <button onClick={() => { setLangOpen(!langOpen); setCurOpen(false); }} aria-label={t('languageLabel')} aria-haspopup="listbox" aria-expanded={langOpen} className="text-sm text-olive hover:text-clay px-3 py-2 min-h-[44px] inline-flex items-center border border-line rounded transition-colors">
              {LOCALE_LABELS[locale]}
            </button>
            {langOpen && (
              <div role="listbox" aria-label={t('languageLabel')} className="absolute end-0 top-full mt-1 bg-paper border border-line rounded shadow-lg z-50">
                {locales.map((l) => (
                  <Link
                    key={l}
                    role="option"
                    aria-selected={l === locale}
                    href={`/${l}${pathWithoutLocale}`}
                    hrefLang={l}
                    lang={l}
                    onClick={() => setLangOpen(false)}
                    aria-current={l === locale ? 'true' : undefined}
                    className={`block w-full text-start px-4 py-2.5 text-sm hover:bg-limestone transition-colors ${l === locale ? 'text-accentText font-semibold' : 'text-ink'}`}
                  >
                    {LOCALE_LABELS[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')} aria-expanded={menuOpen} aria-controls="mobile-menu" className="lg:hidden text-olive p-2 -mr-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} tabIndex={-1} className="lg:hidden border-t border-line bg-limestone outline-none">
          {navItems.map((label, i) => (
            <a
              key={i}
              href={`#${NAV_IDS[i]}`}
              aria-current={active === NAV_IDS[i] ? 'location' : undefined}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 min-h-[44px] flex items-center text-sm border-b border-line last:border-0 transition-colors ${active === NAV_IDS[i] ? 'text-clay font-medium' : 'text-olive hover:text-clay'}`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
