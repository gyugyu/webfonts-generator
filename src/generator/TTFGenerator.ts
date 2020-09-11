import svg2ttf from 'svg2ttf'
import FontGenerator, { GeneratorOptions } from './FontGenerator'
import SVGGenerator from './SVGGenerator'

export default class TTFGenerator extends FontGenerator {
  svgGenerator: SVGGenerator
  svgFont!: Buffer
  ttfFont?: Buffer

  constructor(options: GeneratorOptions, svgGenerator: SVGGenerator) {
    super(options)
    this.svgGenerator = svgGenerator
  }

  async init() {
    await this.svgGenerator.init()
    const { data: svgFont } = await this.svgGenerator.generate()
    this.svgFont = svgFont
  }

  async generate() {
    if (this.ttfFont) {
      return { type: 'ttf', data: this.ttfFont }
    }
    const font = svg2ttf(this.svgFont.toString(), { ts: 1484141760000 })
    this.ttfFont = Buffer.from(font.buffer)
    return { type: 'ttf', data: this.ttfFont }
  }
}
