import { FSWatcher, mkdirSync, readdirSync, readFileSync, watch } from 'fs'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { Plugin } from 'vite'
import { compileTemplate } from 'vue/compiler-sfc'

const toCamelCase = (str: string) => {
    return str
        .replace('.svg', '')
        .replace(/[_-](\w)/g, (_, char) => char.toUpperCase())
        .replace(/^./, char => char.toUpperCase())
}
const rootPath = process.cwd()
const vid = '~vic/'
const components = new Map<string, string>()
const files = new Map<string, string>()
let watcher: FSWatcher | null = null

// const componentTemplate = '<template>@@svg@@</template>'
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
    prefix: string
    typeFilePath: string
}
export const makeIconResolver = (initOptions: Partial<MakeResolveOptions> = {}) => {
    const options = Object.assign({
        modulePath: '',
        customPath: 'src/assets/icons',
        prefix: 'Icon',
        typeFilePath: 'src/globalIconComponents.d.ts'
    },
    initOptions)
    if (!options.customPath && !options.modulePath) {
        throw new Error('modulePath or customPath is required')
    }
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
    return (name: string) => {
        if (name.startsWith(options.prefix)) {
            if (!files.has(name)) {
                console.warn('\x1B[31m', `icon '${name}' not found`)
                return
            }
            return `${vid}${name}`
        }
    }
}

export const makeIconPlugin = ({
    iconAttribute = 'icon'
}: { iconAttribute?: string } = {}): Plugin[] => {
    return [{
        name: 'make-icon-plugin',
        resolveId(id) {
            if (id.startsWith(vid)) {
                return id
            }
        },
        load(id) {
            if (id.startsWith(vid)) {
                const name = id.replace(vid, '').replace('.vue', '')
                if (components.has(name)) {
                    return components.get(name)
                }
                const filePath = files.get(name)!
                const file = readFileSync(filePath, { encoding: 'utf-8' })
                const { code } = compileTemplate({
                    filename: name,
                    id: id,
                    source: file.replace('<svg', `<svg ${iconAttribute}`)
                })
                const component = code.replace('export function', 'export default function')
                components.set(name, component)
                return component
            }
        }
    }, {
        name: 'exit-process',
        apply: 'build',
        enforce: 'post',
        closeBundle() {
            if (watcher) {
                watcher.close()
            }
        }
    }]
}
