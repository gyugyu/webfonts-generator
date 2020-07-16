import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'
import FontGenerator from './FontGenerator'
import TTFGenerator from './TTFGenerator'

type GeneratorType = 'eot' | 'woff' | 'woff2'

export default class FromTTFGenerator implements FontGenerator<Buffer> {
  type: GeneratorType
  ttfGenerator: TTFGenerator
  ttfFont!: Buffer
  font?: Buffer

  constructor(type: GeneratorType, ttfGenerator: TTFGenerator) {
    this.type = type
    this.ttfGenerator = ttfGenerator
  }

  async init() {
    this.ttfFont = await this.ttfGenerator.generate()
  }

  async generate() {
    if (this.font) {
      return this.font
    }
    let mod: typeof ttf2woff2
    switch (this.type) {
      case 'eot':
        mod = ttf2eot
      case 'woff':
        mod = ttf2woff
      case 'woff2':
        mod = ttf2woff2
      default:
        mod = ttf2woff2
    }
    this.font = mod(this.ttfFont)
    return this.font
  }
}
