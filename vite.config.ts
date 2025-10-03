import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.ts'
import { name, version } from './package.json'

export default defineConfig({
    resolve: {
        alias: {
            '@': `${path.resolve(__dirname, 'src')}`
        }
    },
    plugins: [
        vue(),
        crx({ manifest }),
        zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
        tailwindcss(),
        vueDevTools()
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
