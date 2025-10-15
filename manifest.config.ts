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
    commands: {
        openPopup: {
            suggested_key: {
                default: 'Alt+B',
                mac: 'Ctrl+B'
            },
            description: '打开扩展弹出页'
        },
        _execute_action: {
            suggested_key: {
                default: 'Ctrl+B',
                mac: 'Command+B'
            },
            description: '打开侧边栏'
        }
    },
    side_panel: {
        default_path: 'src/sidepanel/index.html'
    },
    web_accessible_resources: [
        {
            resources: [
                '_favicon/*'
            ],
            matches: ['<all_urls>'],
            use_dynamic_url: true
        }
    ],
    host_permissions: [
        'https://*/*',
        'http://*/*'
    ],
    background: {
        service_worker: 'src/utils/serviceWorker.ts'
    }
})
