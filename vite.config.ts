import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.ts'
import { name, version } from './package.json'
import Components from 'unplugin-vue-components/vite'
import { makeIconPlugin, makeIconResolver } from './plugins/makeIcon.ts'
export default defineConfig({
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
        // vueDevTools()
    ],
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                newtab: 'src/newtab/index.html'
            }
        }
    },
    server: {
        cors: {
            origin: [
                /chrome-extension:\/\//
            ]
        },
        port: 3999
    }
})
