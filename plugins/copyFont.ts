import { copyFileSync } from 'fs'
import { resolve } from 'path'

const targetPath = resolve(process.cwd(), 'src/assets/material-icons-outlined.woff2')
const sourcePath = resolve(process.cwd(), 'node_modules/material-icons/iconfont/material-icons-outlined.woff2')
copyFileSync(sourcePath, targetPath)
