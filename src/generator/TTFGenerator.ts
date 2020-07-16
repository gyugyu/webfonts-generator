import FontGenerator from './FontGenerator'
import SVGGenerator from './SVGGenerator'
import svg2ttf from 'svg2ttf'

export default class TTFGenerator implements FontGenerator<Buffer> {
  svgGenerator: SVGGenerator
  svgFont!: string
  ttfFont?: Buffer

  constructor(svgGenerator: SVGGenerator) {
    this.svgGenerator = svgGenerator
  }

  async init() {
    this.svgFont = await this.svgGenerator.generate()
  }

  async generate() {
    if (this.ttfFont) {
      return this.ttfFont
    }
    const font = svg2ttf(this.svgFont, {})
    this.ttfFont = new Buffer(font.buffer)
    return this.ttfFont
  }
}
