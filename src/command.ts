import { program } from 'commander'
import fs from 'fs'
import index from './index'

const pkgJson = require('../package.json')

program
  .version(pkgJson.version)
  .arguments('<root>')
  .action(async (root: string) => {
    if (!fs.existsSync(root)) {
      throw new Error()
    }
    await index(root)
  })

program.parse(process.argv)
