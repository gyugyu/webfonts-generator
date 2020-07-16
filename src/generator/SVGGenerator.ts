import FontGenerator from './FontGenerator'
import SVGIcons2SVGFontStream from 'svgicons2svgfont'

export default class SVGGenerator implements FontGenerator<string> {
  font?: string

  async init() {

  }

  async generate() {
    if (this.font) {
      return this.font
    }

    return await new Promise<string>((resolve, reject) => {
      const fontStream = new SVGIcons2SVGFontStream({})
      fontStream
        .on('data', chunk => {
          this.font = ''
          resolve(this.font)
        })
        .on('error', err => {
          reject(err)
        })
        .on('end', () => {
          resolve()
        })
      fontStream.write({})
      fontStream.end()
    })
  }
}
