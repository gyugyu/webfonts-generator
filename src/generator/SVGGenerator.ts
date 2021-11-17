import fs from 'fs'
import path from 'path'
import SVGIcons2SVGFontStream from 'svgicons2svgfont'
import FontGenerator, { GeneratorOptions } from './FontGenerator'
import { FileRefs } from '../CheckPoint'

type SVGIconStream = fs.ReadStream & {
  metadata: {
    name: string,
    unicode: string[]
  }
}

export default class SVGGenerator extends FontGenerator {
  fileRefs: FileRefs
  font?: Buffer

  constructor(options: GeneratorOptions, fileRefs: FileRefs) {
    super(options)
    this.fileRefs = fileRefs
  }

  async init() { }

  async generate() {
    if (this.font) {
      return { type: 'svg', data: this.font }
    }

    return await new Promise<{ type: 'svg', data: Buffer }>((resolve, reject) => {
      let buffer = Buffer.from('')
      const fontStream = new SVGIcons2SVGFontStream({
        fontName: this.options.fontName,
        ...this.options.svg,
      })
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

      Object.keys(this.fileRefs).forEach(file => {
        const glyph: SVGIconStream = fs.createReadStream(path.join(this.options.root, file)) as SVGIconStream
        const { name, codePoint } = this.fileRefs[file]

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
