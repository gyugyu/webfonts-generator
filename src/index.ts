import buildFontSetGenerator from './buildFontSetGenerator'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import { GeneratorOptions } from './generator/FontGenerator'

export interface Options extends GeneratorOptions {
  css: boolean
  startCodePoint: number
}

const defaultOptions: Options = {
  fontName: 'iconfont',
  css: true,
  types: ['eot', 'woff', 'woff2'],
  startCodePoint: 0xF101,
}

export type CodePoints = Record<string, { codePoint: number, name: string }>

function generateCodePoints(files: string[], codePoint: number): CodePoints {
  return files.reduce<CodePoints>((pre, file) => {
    const name = path.basename(file, path.extname(file))
    const cur = { [file]: { name, codePoint } }
    codePoint++
    return { ...pre, ...cur }
  }, {})
}

export default async function index(files: string[], dest: string, options: Partial<Options> = {}) {
  const mergedOptions = { ...defaultOptions, options }
  const codePoints = generateCodePoints(files, mergedOptions.startCodePoint)
  const generator = buildFontSetGenerator(mergedOptions, codePoints)
  const fonts = await generator.generate()
  fonts.forEach(font => {
    mkdirp.sync(dest)
    fs.writeFileSync(path.join(dest, `${options.fontName}.${font.type}`), font.data)
  })
}