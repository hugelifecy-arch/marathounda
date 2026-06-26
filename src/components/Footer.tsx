import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-darker text-paper/60 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="34" height="34" viewBox="0 0 40 40">
                <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="#B5764D" strokeWidth="1.5" />
                <path d="M8 26 L14 18 L20 24 L26 14 L32 26 Z" fill="#B5764D" opacity="0.85" />
                <circle cx="28" cy="11" r="3" fill="#B5764D" />
                <line x1="8" y1="29" x2="32" y2="29" stroke="#F4F1EA" strokeWidth="1.5" />
              </svg>
              <div style={{ lineHeight: 1 }}>
                <div className="font-fraunces text-lg font-semibold text-paper" style={{ letterSpacing: 0.5 }}>TERRA</div>
                <div className="text-clay font-medium" style={{ fontSize: 9, letterSpacing: 4, marginTop: 1 }}>SOMETHING</div>
              </div>
            </div>
            <p className="text-sm font-outfit leading-relaxed">{t('address')}</p>
          </div>
          <div>
            <p className="text-sm font-outfit space-y-1">
              <span className="block">+357 94 000015</span>
              <span className="block">+357 99 854773</span>
              <span className="block">+357 99 478073</span>
              <span className="block">info@kalaitsidis.com</span>
            </p>
          </div>
          <div className="text-sm font-outfit">
            <p>{t('developer')}: Rigilia Enterprises Ltd</p>
            <p className="mt-1">{t('poweredBy')}: GN Kalaitsidis Capital Ltd</p>
            <p className="mt-1">{t('architect')}: Demis Demetriades Architects LLC</p>
          </div>
        </div>
        <div className="border-t border-paper/10 pt-6">
          <p className="text-xs font-outfit leading-relaxed">{t('footerNote')}</p>
          <p className="text-xs font-outfit mt-2">© {new Date().getFullYear()} Rigilia Enterprises Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
