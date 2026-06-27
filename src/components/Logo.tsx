/**
 * Shared brand lockup (mark + wordmark), used by Header and Footer so the two
 * stay in sync. The "Terra Something" wordmark is a logotype (exempt from text
 * contrast rules); the sub-word uses a rem font-size so it scales with the
 * user's font-size preference (WCAG 1.4.4).
 */
export default function Logo({ variant = 'onLight' }: { variant?: 'onLight' | 'onDark' }) {
  const onDark = variant === 'onDark';
  const wordmark = onDark ? 'text-paper' : 'text-ink';
  const baseline = onDark ? '#F4F1EA' : '#22201C';

  return (
    <span className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="#B5764D" strokeWidth="1.5" />
        <path d="M8 26 L14 18 L20 24 L26 14 L32 26 Z" fill="#B5764D" opacity="0.85" />
        <circle cx="28" cy="11" r="3" fill="#B5764D" />
        <line x1="8" y1="29" x2="32" y2="29" stroke={baseline} strokeWidth="1.5" />
      </svg>
      <span className="leading-none">
        <span className={`block font-fraunces text-lg font-semibold tracking-[0.03em] ${wordmark}`}>TERRA</span>
        <span
          className="block font-medium text-clay"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.25em', marginTop: 1 }}
        >
          SOMETHING
        </span>
      </span>
    </span>
  );
}
