/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/index.html","./html/cssbuild.html"],
  theme: {
    extend: {
      colors: {
        'tq-midnight' : '#05162e',
        'tq-dblue': '#17254e',
        'tq-blue': '#385e94',
        'tq-dcyan':'#2aa887',
        'tq-cyan': '#73ab9c',
        'tq-teal': '#91dea7',
        'tq-mint': '#dfffd1',
        'tq-lmint':'#f0ffdc'


      }
      
    },
  },
  plugins: [],
}

