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
