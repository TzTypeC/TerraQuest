/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/index.html","./html/cssbuild.html","./html/forum.html", "./html/maintenance.html", "./html/upload.html", "./html/mustlogin.html"],
  theme: {
    extend: {
      colors: {
        'tq-midnight' : '#05162e',
        'tq-dblue': '#17254e',
        'tq-ablue': '#182e5a',
        'tq-blue': '#1b3775',
        // JANGAN PAKE CYAN GAK GUNA
        'tq-dcyan':'#2aa887',
        'tq-cyan': '#73ab9c',
        // JANGAN PAKE CYAN GAK GUNA
        'tq-teal': '#abffab',
        'tq-mint': '#dfffd1',
        'tq-lmint':'#f0ffdc',
        'tq-vlmint':'#f5fffa'


      },
      fontFamily: {
        poppins: ['Poppins']
      },

      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
          'pos-0': '0% 100%',
          'pos-100': '100% 0%',
      },
    },
  },
  plugins: [],
}

