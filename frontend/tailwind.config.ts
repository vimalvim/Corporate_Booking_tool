import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#121A2B',
          800: '#1A2439',
          700: '#22304A',
          600: '#2C3D5C',
        },
        paper: '#F7F6F1',
        panel: '#FFFFFF',
        line: '#E1DCCC',
        brass: {
          DEFAULT: '#B8862F',
          600: '#A0741F',
          100: '#F3E6CC',
        },
        teal: {
          DEFAULT: '#2B6E63',
          600: '#215A51',
          100: '#DCEAE7',
        },
        brick: {
          DEFAULT: '#A6432E',
          600: '#8C3524',
          100: '#F3DFD9',
        },
        slate: {
          DEFAULT: '#5B6472',
          400: '#8A93A0',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '10px',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(18, 26, 43, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
