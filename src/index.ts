import buildFontSetGenerator from './buildFontSetGenerator'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import { GeneratorOptions } from './generator/FontGenerator'

export interface Options extends GeneratorOptions {
  startCodePoint: number
}

const defaultOptions: Options = {
  fontName: 'iconfont',
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

function buildManifest(options: Options, codePoints: CodePoints) {
  return {
    fontFamily: options.fontName,
    src: options.types.reduce<Record<string, string>>((pre, type) => {
      return { ...pre, [type]: `${options.fontName}.${type}` }
    }, {}),
    codePoints: Object.keys(codePoints).reduce<Record<string, number>>((pre, file) => {
      const codePoint = codePoints[file]
      return { ...pre, [codePoint.name]: codePoint.codePoint }
    }, {})
  }
}

export default async function index(files: string[], dest: string, options: Partial<Options> = {}) {
  const mergedOptions: Options = { ...defaultOptions, ...options }
  const codePoints = generateCodePoints(files, mergedOptions.startCodePoint)

  const generator = buildFontSetGenerator(mergedOptions, codePoints)
  const fonts = await generator.generate()
  fonts.forEach(font => {
    mkdirp.sync(dest)
    fs.writeFileSync(path.join(dest, `${options.fontName}.${font.type}`), font.data)
  })

  const manifest = buildManifest(mergedOptions, codePoints)
  mkdirp.sync(dest)
  fs.writeFileSync(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
}