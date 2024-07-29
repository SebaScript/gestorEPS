/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.html',
    './src/**/*.js',
    './src/pages/**/*.html',
    './src/scripts/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        aculonica: ['Aclonica', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
