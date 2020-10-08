import fs from 'fs'
import path from 'path'

const filename = 'fontspec.lock'

export type FileRefs = Record<string, { codePoint: number, name: string }>

interface CheckPoint {
  version: string
  fileRefs: FileRefs
}

export function loadCheckPoint(root: string): CheckPoint | null {
  const file = path.join(root, filename)
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(path.join(root, filename), 'utf8')
    return JSON.parse(content)
  }
  return null
}

const { version } = require('../package.json')

export function saveCheckPoint(root: string, checkPoint: Omit<CheckPoint, 'version'>): void {
  const fullCheckPoint: CheckPoint = { ...checkPoint, version }
  const content = JSON.stringify(fullCheckPoint, null, 2)
  fs.writeFileSync(path.join(root, filename), content, 'utf8')
}
