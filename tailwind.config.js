const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./public/index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        /* Brand anchor — the original Grade-Manager navy. */
        brand: {
          DEFAULT: '#0A2463',
          soft: '#1B3B8F',
          /* Focus rings and accents. Non-text, so 3:1 against the page is enough. */
          bright: '#4C6FFF',
          /*
           * Button fills in dark mode. Slightly deeper than `bright` because
           * white text on #4C6FFF is only 4.18:1; this is 4.79:1.
           */
          fill: '#4364F5',
        },
        /* Light theme surfaces and text. */
        paper: {
          base: '#F5F7FC',
          card: '#FFFFFF',
          raised: '#EEF1F9',
          border: '#D8DEEE',
          text: '#0A2463',
          muted: '#55618A',
        },
        /* Dark theme surfaces and text — navy-tinted, not grey. */
        night: {
          base: '#060B1A',
          card: '#0E1730',
          raised: '#16203D',
          border: '#24304F',
          text: '#E8ECF7',
          muted: '#93A0C0',
        },
        /*
         * Swiss grade tones. `fg`/`bg`/`ring` are light theme, the `d*`
         * variants are dark theme. Consumed only via getGradeTone().
         */
        tone: {
          fail: {
            fg: '#B3261E',
            bg: '#FDECEA',
            ring: '#F3B4AE',
            dfg: '#FF9B92',
            dbg: '#3A1512',
            dring: '#6B2A24',
          },
          pass: {
            fg: '#8A5200',
            bg: '#FFF4E0',
            ring: '#F0D19A',
            dfg: '#FFC46B',
            dbg: '#3A2A0D',
            dring: '#6B5220',
          },
          good: {
            fg: '#146B3A',
            bg: '#E6F5EC',
            ring: '#A8D9BC',
            dfg: '#6EE7A0',
            dbg: '#0D2D1C',
            dring: '#1F5C3A',
          },
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '1rem',
        control: '0.625rem',
        chip: '0.625rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 36, 99, 0.06), 0 8px 24px -12px rgba(10, 36, 99, 0.18)',
        'card-hover':
          '0 1px 2px rgba(10, 36, 99, 0.08), 0 16px 32px -16px rgba(10, 36, 99, 0.28)',
        'card-dark': '0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px -16px rgba(0, 0, 0, 0.7)',
      },
      maxHeight: {
        grades: '11rem',
      },
    },
  },
  plugins: [
    /*
     * `hoverable:` only applies on devices that can actually hover. Controls
     * that reveal on hover must stay visible on touch, where there is no hover
     * state to trigger them.
     */
    plugin(({ addVariant }) => {
      addVariant('hoverable', '@media (hover: hover) and (pointer: fine)')
    }),
  ],
}
