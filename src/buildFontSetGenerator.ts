import FontGenerator from './generator/FontGenerator'
import FromTTFGenerator from './generator/FromTTFGenerator'
import SVGGenerator from './generator/SVGGenerator'
import TTFGenerator from './generator/TTFGenerator'

class FontSetGenerator {
  generators: FontGenerator<string | Buffer>[]

  constructor(generators: FontGenerator<string | Buffer>[]) {
    this.generators = generators
  }

  async generate() {
    await Promise.all(this.generators.map(g => g.init()))
    await Promise.all(this.generators.map(g => g.generate()))
  }
}

export default function buildFontSetGenerator() {
  const svgGenerator = new SVGGenerator()
  const ttfGenerator = new TTFGenerator(svgGenerator)
  return new FontSetGenerator([
    new FromTTFGenerator('eot', ttfGenerator),
    new FromTTFGenerator('woff', ttfGenerator),
    new FromTTFGenerator('woff2', ttfGenerator),
  ])
}
