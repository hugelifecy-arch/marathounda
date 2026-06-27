import { useTranslations } from 'next-intl';
import Logo from '@/components/Logo';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-darker text-paper/60 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-3">
              <Logo variant="onDark" />
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
