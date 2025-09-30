import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
        48: 'public/logo.png'
    },
    chrome_url_overrides: {
        newtab: 'src/newtab/index.html'
    },
    action: {
        default_icon: {
            48: 'public/logo.png'
        },
        default_popup: 'src/popup/index.html'
    },
    permissions: [
        'bookmarks',
        'favicon',
        'storage',
        'history',
        'management',
        'sidePanel',
        'commands',
        'tabGroups',
        'tabs'
    ],
    content_scripts: [{
        js: ['src/content/main.ts'],
        matches: ['<all_urls>']
    }],
    side_panel: {
        default_path: 'src/sidepanel/index.html'
    },
    web_accessible_resources: [
        {
            resources: [
                '_favicon/*',
                'assets/*',
                'node_modules/.pnpm/material-icons@1.13.14/node_modules/material-icons/iconfont/*.woff',
                'node_modules/.pnpm/material-icons@1.13.14/node_modules/material-icons/iconfont/*.woff2',
                'node_modules/.pnpm/material-icons@1.13.14/node_modules/material-icons/iconfont/*.ttf'
            ],
            matches: ['<all_urls>'],
            use_dynamic_url: true
        }
    ],
    host_permissions: [
        'https://*/*',
        'http://*/*'
    ]
})
