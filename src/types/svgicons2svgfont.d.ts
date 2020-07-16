declare module 'svgicons2svgfont' {
  import fs from 'fs'

  class SVGIcons2SVGFontStream extends fs.WriteStream {
  }

  export default SVGIcons2SVGFontStream
}
