/* Tailwind config for the frontend react app. This is where the app theme should be defined: https://v2.tailwindcss.com/docs/configuration. */
import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter var', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        display: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          DEFAULT: '#2E5E4E',
          hover: '#24493D',
          dark: '#1C382F',
          soft: '#E7EFEA',
          border: '#C3D6CC',
        },
        gold: {
          DEFAULT: '#C49A5B',
          light: '#E2C89C',
          dark: '#9E7A3D',
          soft: '#FBF5EB',
          border: '#EAD7BA',
        },
        ivory: {
          bg: '#FAF8F4',
          card: '#FFFFFF',
          subtle: '#F1EEE7',
          muted: '#E8E3D9',
          divider: '#EFECE5',
        },
        ink: {
          DEFAULT: '#1E1E1C',
          muted: '#5C5C57',
          soft: '#8A8A84',
        },
        status: {
          success: '#2F7D5B',
          successBg: '#E7F2EC',
          warning: '#B7832F',
          warningBg: '#F7EFDF',
          danger: '#B4553F',
          dangerBg: '#F6E7E2',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: '#2E5E4E',
          2: '#C49A5B',
          3: '#2F7D5B',
          4: '#9E7A3D',
          5: '#5C5C57',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(30, 30, 28, 0.04), 0 1px 2px 0 rgba(30, 30, 28, 0.02)',
        card: '0 4px 20px -2px rgba(30, 30, 28, 0.05), 0 2px 6px -1px rgba(30, 30, 28, 0.03)',
        elevation:
          '0 10px 30px -4px rgba(30, 30, 28, 0.08), 0 4px 12px -2px rgba(30, 30, 28, 0.04)',
        glow: '0 0 20px rgba(46, 94, 78, 0.12)',
        goldGlow: '0 0 18px rgba(196, 154, 91, 0.18)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config
