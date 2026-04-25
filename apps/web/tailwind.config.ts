import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        primary: {
          50: '#FEF6F1',
          100: '#FBE5D7',
          200: '#F5C4B3',
          400: '#E8765A',
          500: '#D85A30',
          600: '#B8431F',
          800: '#712B13',
          900: '#4A1B0C',
        },
        accent: {
          50: '#FEF8ED',
          100: '#FAEEDA',
          400: '#EF9F27',
          600: '#BA7517',
          800: '#633806',
        },
        canvas: '#FAF7F2',
        surface: '#FFFFFF',
        muted: '#F5F1EA',
        hover: '#EFEAE0',
        border: {
          DEFAULT: '#E8E1D3',
          strong: '#D3C9B5',
        },
        ink: {
          primary: '#2C2620',
          body: '#4A3F35',
          muted: '#8A7D6E',
          subtle: '#B8A994',
        },
      },
      fontFamily: {
        display: ['RIDIBatang', 'Noto Serif KR', 'serif'],
        body: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
        accent: ['IBM Plex Sans KR', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 6px rgba(44, 38, 32, 0.05)',
        md: '0 4px 8px rgba(44, 38, 32, 0.06), 0 2px 4px rgba(44, 38, 32, 0.04)',
        lg: '0 8px 24px rgba(44, 38, 32, 0.08), 0 4px 8px rgba(44, 38, 32, 0.04)',
        sheet: '0 -4px 16px rgba(44, 38, 32, 0.08)',
      },
      minHeight: {
        touch: '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        touch: '44px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
};

export default config;
