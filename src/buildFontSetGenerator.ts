import FontGenerator, { GeneratedFont, GeneratorOptions } from './generator/FontGenerator'
import FromTTFGenerator, { GeneratorType as FromTTFGeneratorType } from './generator/FromTTFGenerator'
import SVGGenerator from './generator/SVGGenerator'
import TTFGenerator from './generator/TTFGenerator'
import { FileRefs } from './CheckPoint'

export interface Options extends GeneratorOptions {
  startCodePoint: number
}

class FontSetGenerator {
  generators: FontGenerator[]

  constructor() {
    this.generators = []
  }

  async generate() {
    for (const generator of this.generators) {
      await generator.init()
    }
    return await this.generators.reduce<Promise<GeneratedFont[]>>(async (chain, generator) => {
      const pre = await chain
      const cur = await generator.generate()
      return pre.concat(cur)
    }, Promise.resolve([]))
  }
}

export default function buildFontSetGenerator(options: Options, fileRefs: FileRefs) {
  const generator = new FontSetGenerator()

  const svgGenerator = new SVGGenerator(options, fileRefs)
  if (options.types.includes('svg')) {
    generator.generators.push(svgGenerator)
  }

  const ttfGenerator = new TTFGenerator(options, svgGenerator)
  if (options.types.includes('ttf')) {
    generator.generators.push(ttfGenerator)
  }

  options.types
    .filter((type): type is FromTTFGeneratorType => ['eot', 'woff', 'woff2'].includes(type))
    .forEach(type => {
      generator.generators.push(new FromTTFGenerator(options, type, ttfGenerator))
    })

  return generator
}
