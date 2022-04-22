import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { GeneratorType } from './generator/FontGenerator'

const filename = 'fontspec.yaml'

interface FontSpec {
  name: string
  dest: string
  types?: GeneratorType[]
  svg?: {
    fontHeight?: number
    normalize?: boolean
  }
}

function isFontSpec(o: any): o is FontSpec {
  return typeof o === 'object' && typeof o.name === 'string' && typeof o.dest === 'string'
}

export function loadFontSpec(root: string): FontSpec {
  const content = fs.readFileSync(path.join(root, filename), 'utf8')
  const data = yaml.load(content)
  if (isFontSpec(data)) {
    return data
  }
  throw new Error()
}
