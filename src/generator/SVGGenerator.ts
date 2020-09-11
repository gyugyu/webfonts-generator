import fs from 'fs'
import SVGIcons2SVGFontStream from 'svgicons2svgfont'
import FontGenerator, { GeneratorOptions } from './FontGenerator'
import { CodePoints } from '../index'

type SVGIconStream = fs.ReadStream & {
  metadata: {
    name: string,
    unicode: string[]
  }
}

export default class SVGGenerator extends FontGenerator {
  codePoints: CodePoints
  font?: Buffer

  constructor(options: GeneratorOptions, codePoints: CodePoints) {
    super(options)
    this.codePoints = codePoints
  }

  async init() { }

  async generate() {
    if (this.font) {
      return { type: 'svg', data: this.font }
    }

    return await new Promise<{ type: 'svg', data: Buffer }>((resolve, reject) => {
      let buffer = Buffer.from('')
      const fontStream = new SVGIcons2SVGFontStream({ fontName: this.options.fontName })
      fontStream
        .on('data', chunk => {
          buffer = Buffer.concat([buffer, chunk])
        })
        .on('error', err => {
          reject(err)
        })
        .on('end', () => {
          this.font = buffer
          resolve({ type: 'svg', data: buffer })
        })

      Object.keys(this.codePoints).forEach(file => {
        const glyph: SVGIconStream = fs.createReadStream(file) as SVGIconStream
        const { name, codePoint } = this.codePoints[file]

        const ligature = name.split('').map((_, i) => {
          return String.fromCharCode(name.charCodeAt(i))
        }).join('')

        glyph.metadata = {
          name,
          unicode: [String.fromCharCode(codePoint), ligature]
        }
        fontStream.write(glyph)
      })

      fontStream.end()
    })
  }
}
