import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        limestone: '#F4F1EA',
        paper: '#FFFFFF',
        ink: '#22201C',
        clay: '#B5764D',
        clayDark: '#9A5E38',
        olive: '#5A5F4A',
        sage: '#7C8868',
        gold: '#E8B96E',
        line: '#E3DDD0',
        dark: '#22201C',
        darker: '#1A1814',
        // Semantic role tokens (WCAG 2.2 AA). Use these for TEXT so contrast
        // is guaranteed:
        //   accentText  — accent-coloured normal-weight text/links on light
        //                 surfaces (clayDark, 5.21:1 on limestone/paper).
        //   onDarkMuted — muted body/disclaimer text on dark/darker (≈6:1).
        // Contrast contract: `clay` is for LARGE/BOLD text only (≥18px, or
        // ≥14px bold → 3:1); `olive`/`accentText` for normal-weight text;
        // `gold` only on dark; `sage` fills need ink/dark text, not sage text.
        accentText: '#9A5E38',
        onDarkMuted: '#9E9C98',
      },
      fontFamily: {
        fraunces: ['var(--font-fraunces)', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
