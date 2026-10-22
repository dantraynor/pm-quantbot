import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bb: {
          bg: '#0B0B0E',
          panel: '#131318',
          panel2: '#191920',
          border: '#23232C',
          rule: '#2E2E38',
          green: '#C5FF3D',
          red: '#FF4A4A',
          yellow: '#F5CB5C',
          cyan: '#7DD3FC',
          orange: '#FF6B1A',
          purple: '#E6BCFA',
          text: '#ECE6D9',
          dim: '#8A8478',
          muted: '#45433D',
          ink: '#06060A',
          paper: '#ECE6D9',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['var(--font-serif)', 'Instrument Serif', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
        wider3: '0.24em',
      },
    },
  },
  plugins: [],
};

export default config;
