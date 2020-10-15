import { GeneratorType as FromTTFGeneratorType } from './FromTTFGenerator'

export type GeneratorType = 'svg' | 'ttf' | FromTTFGeneratorType

export interface GeneratorOptions {
  fontName: string
  types: GeneratorType[]
  root: string
}

export type GeneratedFont = { type: string, data: Buffer }


export default abstract class FontGenerator {
  options: GeneratorOptions

  constructor(options: GeneratorOptions) {
    this.options = options
  }

  abstract async init(): Promise<void>
  abstract async generate(): Promise<GeneratedFont>
}
