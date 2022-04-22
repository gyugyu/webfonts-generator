import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'
import FontGenerator, { GeneratorOptions } from './FontGenerator'
import TTFGenerator from './TTFGenerator'

export type GeneratorType = 'eot' | 'woff' | 'woff2'

export default class FromTTFGenerator extends FontGenerator {
  type: GeneratorType
  ttfGenerator: TTFGenerator
  ttfFont!: Buffer
  font?: Buffer

  constructor(options: GeneratorOptions, type: GeneratorType, ttfGenerator: TTFGenerator) {
    super(options)
    this.type = type
    this.ttfGenerator = ttfGenerator
  }

  async init() {
    await this.ttfGenerator.init()
    const { data: ttfFont } = await this.ttfGenerator.generate()
    this.ttfFont = ttfFont
  }

  async generate() {
    if (this.font) {
      return { type: this.type, data: this.font }
    }

    let mod: (ttf: Buffer) => Buffer
    switch (this.type) {
      case 'eot':
        mod = ttf2eot
        break
      case 'woff':
        mod = ttf2woff
        break
      case 'woff2':
        mod = ttf2woff2
        break
      default:
        mod = ttf2woff2
        break
    }
    const converted = mod(this.ttfFont)
    this.font = Buffer.from(converted.buffer)
    return { type: this.type, data: this.font }
  }
}
