'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import Link from 'next/link';

const LOCALE_LABELS: Record<string, string> = { en: 'EN', ru: 'РУ', el: 'ΕΛ', he: 'עב', zh: '中', de: 'DE' };
const NAV_IDS = ['project', 'residences', 'gallery', 'location', 'calculator', 'enquire'];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = (t.raw('nav') as string[]);

  // Strip the leading locale segment to get the path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';

  return (
    <header className="sticky top-0 z-50 bg-limestone/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#project" className="flex items-center gap-2">
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
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="text-sm text-olive hover:text-clay px-2 py-1 border border-line rounded transition-colors">
              {LOCALE_LABELS[locale]}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-paper border border-line rounded shadow-lg z-50">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}${pathWithoutLocale}`}
                    onClick={() => setLangOpen(false)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-limestone transition-colors ${l === locale ? 'text-clay font-semibold' : 'text-ink'}`}
                  >
                    {LOCALE_LABELS[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-olive">
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
