/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navbar: '#232d3b', // darker shade for navbar and background
        headerStart: '#7b8ce3',
        headerEnd: '#8e5ae8',
        primaryBtn: '#e74c3c',
        cardText: '#2c3e50',
        badgeRed: '#ff6b6b',
        badgeRed2: '#ee5a52',
        badgeGreen: '#28a745',
        badgeGreen2: '#20c997',
        searchShadow: '#e0e0e0',
        cardBg: '#fff',
        loginBg: '#232d3b', // use the same darker shade for login/register bg
        inputBg: '#eaf1fb',
        loginBtn: '#223142',
        loginBtnHover: '#1a2533',
        gold: '#ffd700',
        errorBg: '#f8d7da',
        errorText: '#b94a48',
        errorBorder: '#f5c6cb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 32px 0 rgba(44, 73, 94, 0.10)',
        glow: '0 0 0 4px #ffd70055',
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(90deg, #7b8ce3 0%, #8e5ae8 100%)',
        'badge-green': 'linear-gradient(135deg, #28a745, #20c997)',
        'badge-red': 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 