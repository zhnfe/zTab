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
            include: [/\.vue/, /\.[jt]sx/],
            resolvers: [makeIconResolve({ modulePath: 'node_modules/@material-symbols/svg-400/outlined', typeFilePath: '' })]
        }),
        tailwindcss(),
        zip({ outDir: 'release', outFileName: `${name}-${version}.zip` }),
        // vueDevTools()
        {
            name: 'exit-process',
            apply: 'build',
            enforce: 'post',
            closeBundle() {
                process.exit(0)
            },
            buildEnd(error) {
                if (error) {
                    process.exit(1)
                }
            }
        }
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
