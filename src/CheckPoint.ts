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
  if (!fs.existsSync(file)) {
    return null
  }

  const content = fs.readFileSync(path.join(root, filename), 'utf8')
  const { version, fileRefs } = JSON.parse(content) as CheckPoint

  const migratedFileRefs = Object.keys(fileRefs).reduce<FileRefs>((pre, file) => {
    const relative = file.startsWith(`${root}/`) ? path.relative(root, file) : file
      return { ...pre, [relative]: fileRefs[file] }
  }, {})

  return { version, fileRefs: migratedFileRefs }
}

const { version } = require('../package.json')

export function saveCheckPoint(root: string, checkPoint: Omit<CheckPoint, 'version'>): void {
  const fullCheckPoint: CheckPoint = { ...checkPoint, version }
  const content = JSON.stringify(fullCheckPoint, null, 2)
  fs.writeFileSync(path.join(root, filename), content, 'utf8')
}
