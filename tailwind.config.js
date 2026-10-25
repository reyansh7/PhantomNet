/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#080c14',
          card: '#0d1322',
          surface: '#131b2e',
          border: '#1e293b',
          borderLight: '#334155',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
          purple: '#8b5cf6',
          textMuted: '#94a3b8',
          textDim: '#64748b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
