import { existsSync, mkdirSync, readdirSync, readFileSync, watch, writeFileSync, type FSWatcher } from 'fs'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

const toCamelCase = (str: string) => {
    return str
        .replace('.svg', '')
        .replace(/[_-](\w)/g, (_, char) => char.toUpperCase())
        .replace(/^./, char => char.toUpperCase())
}
export const iconPrefix = 'Icon'

const rootPath = process.cwd()

const componentTemplate = '<template>@@svg@@</template>'
const typeTemplate = `import type { DefineComponent } from 'vue'
declare module 'vue' {
    export interface GlobalComponents {
        @@types@@
    }
}
`

type MakeResolveOptions = {
    modulePath: string
    customPath: string
    targetPath: string
    prefix: string
    typeFilePath: string
}
const defualtResolveOptions: MakeResolveOptions = {
    modulePath: '',
    customPath: 'src/assets/icons',
    targetPath: 'src/.icons',
    prefix: 'Icon',
    typeFilePath: 'src/globalIconComponents.d.ts'
}

let watcher: FSWatcher | null = null
export const makeIconResolve = (initOptions: Partial<MakeResolveOptions> = {}) => {
    const options = Object.assign(defualtResolveOptions, initOptions)
    if (!options.customPath && !options.modulePath) {
        throw new Error('modulePath or customPath is required')
    }
    const files = new Map<string, string>()
    const _setFiles = (path: string, targetPath: string) => {
        const svgFiles = readdirSync(path)
        for (const file of svgFiles) {
            const name = `${options.prefix}${toCamelCase(file)}`
            files.set(name, resolve(rootPath, targetPath, file))
        }
    }
    if (options.customPath) {
        const customPath = resolve(rootPath, options.customPath)
        mkdirSync(customPath, { recursive: true })
        _setFiles(customPath, options.customPath)
        watcher = watch(customPath, eventType => {
            if (eventType === 'rename') {
                _setFiles(customPath, options.customPath)
            }
        })
        process.on('exit', () => {
            if (watcher) {
                watcher.close()
                watcher = null
            }
        })
    }
    if (options.modulePath) {
        _setFiles(resolve(rootPath, options.modulePath), options.modulePath)
    }

    if (options.typeFilePath) {
        let typeFile = ''
        for (const file of files) {
            typeFile += `${file[0]}: DefineComponent<icon>;`
        }
        const typeFilePath = resolve(rootPath, options.typeFilePath)
        writeFile(typeFilePath, typeTemplate.replace('@@types@@', typeFile))
    }
    const targetPath = resolve(rootPath, options.targetPath)
    // 创建icon组件目录
    mkdirSync(targetPath, { recursive: true })
    return (name: string) => {
        if (!name.startsWith(options.prefix) || !files.has(name)) {
            return
        }
        const componentPath = resolve(targetPath, `${name}.vue`)
        if (existsSync(componentPath)) {
            return componentPath
        }
        const svg = readFileSync(files.get(name)!, 'utf-8')
        const component = componentTemplate.replace('@@svg@@', svg.replace('<svg', '<svg class="i-icon"'))
        writeFileSync(componentPath, component)
        return componentPath
    }
}
