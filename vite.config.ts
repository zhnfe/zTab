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
import { makeIconResolve } from './plugins/makeIcon.ts'

export default defineConfig({
    resolve: {
        alias: {
            '@': `${path.resolve(__dirname, 'src')}`
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        crx({ manifest }),
        Components({
            dts: 'src/globalIconComponents.d.ts',
            dirs: [],
            include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/, /\.[tj]sx$/],
            resolvers: [makeIconResolve({ modulePath: 'node_modules/@material-symbols/svg-400/outlined', typeFilePath: '' })]
        }),
        tailwindcss(),
        zip({ outDir: 'release', outFileName: `${name}-${version}.zip` })
        // vueDevTools()
    ],
    build: {
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
