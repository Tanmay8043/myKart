module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),    
    require('@tailwindcss/aspect-ratio'),
  ]
};