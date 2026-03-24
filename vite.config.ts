import type { UserConfig } from 'vite'
import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.ts'
import { name, version } from './package.json'
import { makeIconPlugin, makeIconResolver } from './plugins/makeIcon.ts'

export default defineConfig(({ command }) => {
    const baseConfig: UserConfig = {
        resolve: {
            alias: {
                '@': `${path.resolve(__dirname, 'src')}`
            }
        },
        plugins: [
            makeIconPlugin(),
            vue(),
            vueJsx(),
            crx({ manifest }),
            Components({
                globs: ['!src/components', '!\~vic'],
                resolvers: [
                    makeIconResolver({
                        customPath: 'src/assets/icons',
                        modulePath: 'node_modules/@material-symbols/svg-400/outlined',
                        typeFilePath: 'src/globalIconComponents.d.ts',
                        prefix: 'Icon'
                    })
                ],
                dts: 'src/types/components.d.ts'
            }),
            tailwindcss(),
            zip({ outDir: 'release', outFileName: `${name}-${version}.zip` })
        ],
        build: {
            target: 'esnext'
        },
        server: {
            cors: {
                origin: [
                    /chrome-extension:\/\//
                ]
            },
            port: 3999
        }
    }
    if (command === 'serve') {
        baseConfig.css = {
            postcss: {
                plugins: [
                // 内联 PostCSS 插件，解包所有 @supports
                    {
                        postcssPlugin: 'unwrap-supports',
                        AtRule: {
                            supports(atRule) {
                                atRule.replaceWith(atRule.nodes)
                            }
                        }
                    }
                ]
            }
        }
    }
    return baseConfig
})
