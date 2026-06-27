'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { UNITS } from '@/data/units';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
type FieldName = 'name' | 'email' | 'phone';

export default function EnquiryForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [hp, setHp] = useState('');
  const [interest, setInterest] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const consentRef = useRef<HTMLInputElement>(null);

  // Pre-select a residence when the visitor clicked "Enquire" on a unit.
  useEffect(() => {
    const onPrefill = (e: Event) => setInterest(String((e as CustomEvent<number>).detail));
    window.addEventListener('enquiry:prefill', onPrefill);
    return () => window.removeEventListener('enquiry:prefill', onPrefill);
  }, []);

  const fields: { name: FieldName; label: string; type: string; autoComplete: string; required: boolean; inputMode?: 'email' | 'tel' }[] = [
    { name: 'name', label: t('name'), type: 'text', autoComplete: 'name', required: true },
    { name: 'email', label: t('email'), type: 'email', autoComplete: 'email', required: true, inputMode: 'email' },
    { name: 'phone', label: t('phone'), type: 'tel', autoComplete: 'tel', required: false, inputMode: 'tel' },
  ];

  const validate = (name: FieldName, value: string): string => {
    const v = value.trim();
    if (name === 'name') return v ? '' : t('errRequired');
    if (name === 'email') return !v ? t('errRequired') : isEmail(v) ? '' : t('errEmail');
    return ''; // phone is optional
  };

  const handleBlur = (name: FieldName, value: string) => {
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hp) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const next: Partial<Record<FieldName, string>> = {};
    (['name', 'email', 'phone'] as FieldName[]).forEach((n) => {
      const msg = validate(n, data[n] || '');
      if (msg) next[n] = msg;
    });
    setErrors(next);
    const firstInvalid = (['name', 'email', 'phone'] as FieldName[]).find((n) => next[n]);
    if (firstInvalid) { fieldRefs.current[firstInvalid]?.focus(); return; }
    if (!consent) { setConsentError(true); consentRef.current?.focus(); return; }

    setConsentError(false);
    setStatus('sending');
    try {
      const res = await fetch('/api/enquire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: true }) });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputBase = 'w-full border rounded px-3 py-3 font-outfit text-ink bg-paper focus:border-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1 transition-colors';

  return (
    <div className="bg-limestone py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-olive text-sm font-outfit tracking-widest uppercase">06</span>
        </div>
        <h2 className="font-fraunces text-4xl md:text-5xl text-ink text-center mb-4">{t('enquireTitle')}</h2>
        <p className="section-intro text-olive text-center mb-12">{t('enquireSub')}</p>

        {status === 'sent' ? (
          <div role="status" className="bg-sage/20 border border-sage text-ink p-6 rounded-lg text-center font-outfit">
            {t('thankYou')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-paper border border-line p-8 rounded-xl">
            <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={`enq-${f.name}`} className="block text-sm font-outfit text-ink mb-1">
                  {f.label}
                  {f.required ? (
                    <>
                      <span aria-hidden="true" className="text-accentText"> *</span>
                      <span className="sr-only"> ({t('requiredField')})</span>
                    </>
                  ) : (
                    <span className="text-olive font-normal"> ({t('optional')})</span>
                  )}
                </label>
                <input
                  id={`enq-${f.name}`}
                  name={f.name}
                  type={f.type}
                  inputMode={f.inputMode}
                  required={f.required}
                  aria-required={f.required}
                  autoComplete={f.autoComplete}
                  ref={(el) => { fieldRefs.current[f.name] = el; }}
                  aria-invalid={errors[f.name] ? true : undefined}
                  aria-describedby={errors[f.name] ? `enq-${f.name}-error` : undefined}
                  onBlur={(e) => handleBlur(f.name, e.target.value)}
                  className={`${inputBase} ${errors[f.name] ? 'border-red-600' : 'border-line'}`}
                />
                {errors[f.name] && (
                  <p id={`enq-${f.name}-error`} role="alert" className="text-red-700 text-sm mt-1 font-outfit">{errors[f.name]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="enq-interest" className="block text-sm font-outfit text-ink mb-1">{t('interest')}</label>
              <select id="enq-interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={`${inputBase} border-line`}>
                <option value="">{t('anyUnit')}</option>
                {UNITS.map((u) => (
                  <option key={u.id} value={u.id}>{t('unit')} {u.id} — {u.type} ({u.total} m²)</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="enq-message" className="block text-sm font-outfit text-ink mb-1">{t('message')}</label>
              <textarea id="enq-message" name="message" rows={4} className={`${inputBase} border-line resize-none`} />
            </div>

            <div>
              <label htmlFor="enq-consent" className="flex items-start gap-2 text-sm font-outfit text-olive">
                <input
                  id="enq-consent"
                  name="consent"
                  type="checkbox"
                  ref={consentRef}
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(false); }}
                  aria-invalid={consentError ? true : undefined}
                  aria-describedby={consentError ? 'enq-consent-error' : undefined}
                  className="mt-0.5 h-5 w-5 accent-clay"
                />
                <span>{t('consent')}<span aria-hidden="true" className="text-accentText"> *</span></span>
              </label>
              {consentError && <p id="enq-consent-error" role="alert" className="text-red-700 text-sm mt-1 font-outfit">{t('consentRequired')}</p>}
            </div>

            <button type="submit" disabled={status === 'sending'} className="w-full bg-clayDark hover:bg-[#824a2b] active:bg-[#824a2b] text-paper py-3 rounded font-outfit font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'sending' ? t('sending') : t('send')}
            </button>
            {status === 'error' && (
              <p role="alert" aria-live="assertive" className="text-red-700 text-sm text-center font-outfit">{t('formError')}</p>
            )}
            <p className="text-xs text-olive font-outfit">{t('reserveNote')}</p>
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
              <p className="text-ink font-outfit font-medium text-sm tnum">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
