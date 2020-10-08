import fs from 'fs'
import glob from 'glob'
import mkdirp from 'mkdirp'
import path from 'path'
import buildFontSetGenerator, { Options } from './buildFontSetGenerator'
import { loadCheckPoint, saveCheckPoint, FileRefs } from './CheckPoint'
import { loadFontSpec } from './FontSpec'

const defaultOptions: Omit<Options, 'fontName'> = {
  types: ['eot', 'woff', 'woff2'],
  startCodePoint: 0xF101,
}

function generateFileRefs(files: string[], codePoint: number, fileRefs: FileRefs = {}): FileRefs {
  codePoint = Object.values(fileRefs)
    .reduce((pre, { codePoint: cur }) => cur >= pre ? cur + 1 : pre, codePoint)

  return files.reduce<FileRefs>((pre, file) => {
    const name = path.basename(file, path.extname(file))
    const ref = fileRefs[file]
    if (ref) {
      return { ...pre, [file]: ref }
    }
    const cur = { [file]: { name, codePoint } }
    codePoint++
    return { ...pre, ...cur }
  }, {})
}

function buildManifest(options: Options, fileRefs: FileRefs) {
  return {
    fontFamily: options.fontName,
    src: options.types.reduce<Record<string, string>>((pre, type) => {
      return { ...pre, [type]: `${options.fontName}.${type}` }
    }, {}),
    codePoints: Object.keys(fileRefs).reduce<Record<string, number>>((pre, file) => {
      const codePoint = fileRefs[file]
      return { ...pre, [codePoint.name]: codePoint.codePoint }
    }, {})
  }
}

export default async function index(root: string, options: Partial<Options> = {}) {
  const files = glob.sync(path.join(root, '*.svg'))
  const spec = loadFontSpec(root)
  const dest = path.join(root, spec.dest)
  const checkPoint = loadCheckPoint(root)
  const mergedOptions: Options = { ...defaultOptions, ...options, fontName: spec.name }
  const fileRefs = generateFileRefs(files, mergedOptions.startCodePoint, checkPoint?.fileRefs)

  const generator = buildFontSetGenerator(mergedOptions, fileRefs)
  const fonts = await generator.generate()
  fonts.forEach(font => {
    mkdirp.sync(dest)
    fs.writeFileSync(path.join(dest, `${mergedOptions.fontName}.${font.type}`), font.data)
  })

  const manifest = buildManifest(mergedOptions, fileRefs)
  mkdirp.sync(dest)
  fs.writeFileSync(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  saveCheckPoint(root, { fileRefs })
}
