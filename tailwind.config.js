/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8f7f5',
          100: '#efede8',
          200: '#ddd9d1',
          300: '#c5bfb3',
          400: '#a99f8e',
          500: '#8a7f6b',
          600: '#6b6252',
          700: '#524b3f',
          800: '#3d3830',
          900: '#1a1815',
        },
        paper: '#fefcfa',
        accent: {
          50: '#f0f9f5',
          100: '#dcf0e6',
          200: '#bce0cc',
          300: '#8fc9a8',
          400: '#5aae7e',
          500: '#2d8a56',
          600: '#1f6b41',
          700: '#1a5636',
          800: '#17452d',
          900: '#143a26',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(26,24,21,0.04), 0 4px 12px rgba(26,24,21,0.06)',
        'soft-lg': '0 2px 8px rgba(26,24,21,0.06), 0 12px 32px rgba(26,24,21,0.08)',
      }
    },
  },
  plugins: [],
}
