'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UNITS } from '@/data/units';

export default function EnquiryForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [hp, setHp] = useState('');
  const [interest, setInterest] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  // Pre-select a residence when the visitor clicked "Enquire" on a unit.
  useEffect(() => {
    const onPrefill = (e: Event) => setInterest(String((e as CustomEvent<number>).detail));
    window.addEventListener('enquiry:prefill', onPrefill);
    return () => window.removeEventListener('enquiry:prefill', onPrefill);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hp) return;
    if (!consent) { setConsentError(true); return; }
    setConsentError(false);
    setStatus('sending');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/enquire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: true }) });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">06</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('enquireTitle')}</h2>
        <p className="text-olive text-center mb-12">{t('enquireSub')}</p>

        {status === 'sent' ? (
          <div role="status" className="bg-sage/20 border border-sage text-ink p-6 rounded-lg text-center font-outfit">
            {t('thankYou')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-paper border border-line p-8 rounded-xl">
            <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {[
              { name: 'name', label: t('name'), type: 'text', autoComplete: 'name' },
              { name: 'email', label: t('email'), type: 'email', autoComplete: 'email' },
              { name: 'phone', label: t('phone'), type: 'tel', autoComplete: 'tel' },
            ].map(({ name, label, type, autoComplete }) => (
              <div key={name}>
                <label htmlFor={`enq-${name}`} className="block text-sm font-outfit text-olive mb-1">{label}</label>
                <input id={`enq-${name}`} name={name} type={type} required autoComplete={autoComplete} className="w-full border border-line rounded px-3 py-3 font-outfit text-ink bg-paper focus:border-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1 transition-colors" />
              </div>
            ))}

            <div>
              <label htmlFor="enq-interest" className="block text-sm font-outfit text-olive mb-1">{t('interest')}</label>
              <select id="enq-interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full border border-line rounded px-3 py-3 font-outfit text-ink bg-paper focus:border-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1">
                <option value="">{t('anyUnit')}</option>
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>{t('unit')} {u.id} — {u.type} ({u.total} m²)</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="enq-message" className="block text-sm font-outfit text-olive mb-1">{t('message')}</label>
              <textarea id="enq-message" name="message" rows={4} className="w-full border border-line rounded px-3 py-3 font-outfit text-ink bg-paper focus:border-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1 transition-colors resize-none" />
            </div>

            <div>
              <label htmlFor="enq-consent" className="flex items-start gap-2 text-sm font-outfit text-olive">
                <input
                  id="enq-consent"
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(false); }}
                  aria-invalid={consentError}
                  className="mt-0.5 h-5 w-5 accent-clay"
                />
                <span>{t('consent')}</span>
              </label>
              {consentError && <p role="alert" className="text-red-600 text-sm mt-1 font-outfit">{t('consentRequired')}</p>}
            </div>

            <button type="submit" disabled={status === 'sending'} className="w-full bg-clayDark hover:bg-[#824a2b] active:bg-[#824a2b] text-paper py-3 rounded font-outfit font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'sending' ? t('sending') : t('send')}
            </button>
            <p role="alert" aria-live="assertive" className="text-red-600 text-sm text-center font-outfit">{status === 'error' ? t('formError') : ''}</p>
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
