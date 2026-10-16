export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(244, 114, 182, 0.22)',
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(248, 113, 113, 0.16), transparent 30%)',
      },
    },
  },
  plugins: [],
};
