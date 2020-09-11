import { program } from 'commander'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import index from './index'

program
  .version('0.1.0')
  .arguments('<dirOrGlob>')
  .requiredOption('-n --font-name <fontName>', '(Required) Name for iconfont')
  .requiredOption('-d, --dest <dest>', '(Required) Destination directory')
  .action(async (dirOrGlob: string) => {
    if (fs.existsSync(dirOrGlob)) {
      const stat = fs.statSync(dirOrGlob)
      if (stat.isDirectory()) {
        dirOrGlob = path.join(dirOrGlob, '*')
      }
    }
    const files = glob.sync(dirOrGlob)

    const dest: string = program.dest
    const fontName: string = program.fontName
    await index(files, dest, { fontName })
  })

program.parse(process.argv)