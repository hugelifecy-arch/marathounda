'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UNITS } from '@/data/units';

export default function EnquiryForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [hp, setHp] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hp) return;
    setStatus('sending');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/enquire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-clay text-sm font-outfit tracking-widest uppercase">06</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('enquireTitle')}</h2>
        <p className="text-olive text-center mb-12">{t('enquireSub')}</p>

        {status === 'sent' ? (
          <div className="bg-sage/20 border border-sage text-sage p-6 rounded-lg text-center font-outfit">
            {t('thankYou')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-paper border border-line p-8 rounded-xl">
            <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            {[
              { name: 'name', label: t('name'), type: 'text' },
              { name: 'email', label: t('email'), type: 'email' },
              { name: 'phone', label: t('phone'), type: 'tel' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-sm font-outfit text-olive mb-1">{label}</label>
                <input name={name} type={type} required className="w-full border border-line rounded px-3 py-2 font-outfit text-ink bg-limestone focus:outline-none focus:border-clay transition-colors" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-outfit text-olive mb-1">{t('interest')}</label>
              <select name="interest" className="w-full border border-line rounded px-3 py-2 font-outfit text-ink bg-limestone focus:outline-none focus:border-clay">
                <option value="">{t('anyUnit')}</option>
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>{t('unit')} {u.id} — {u.type} ({u.total} m²)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-outfit text-olive mb-1">{t('message')}</label>
              <textarea name="message" rows={4} className="w-full border border-line rounded px-3 py-2 font-outfit text-ink bg-limestone focus:outline-none focus:border-clay transition-colors resize-none" />
            </div>

            <button type="submit" disabled={status === 'sending'} className="w-full bg-clay hover:bg-clayDark text-paper py-3 rounded font-outfit font-medium transition-colors disabled:opacity-60">
              {status === 'sending' ? '...' : t('send')}
            </button>
            {status === 'error' && <p className="text-red-600 text-sm text-center font-outfit">{t('formError')}</p>}
          </form>
        )}

        <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: t('contactPhone'), value: '+357 94 000015' },
            { label: t('contactWhatsApp'), value: '+357 99 854773' },
            { label: t('contactEmail'), value: 'info@kalaitsidis.com' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-olive text-xs font-outfit mb-1">{label}</p>
              <p className="text-ink font-outfit font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
