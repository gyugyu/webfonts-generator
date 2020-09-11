declare module 'svgicons2svgfont' {
  import fs from 'fs'

  class SVGIcons2SVGFontStream extends fs.WriteStream {
    constructor(options: Record<string, unknown>)
  }

  export default SVGIcons2SVGFontStream
}