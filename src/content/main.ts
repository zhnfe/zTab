import { createApp } from 'vue'
import css from '@/index.css?inline'
import App from './views/App.vue'
import '@/store'

// 将 ArrayBuffer 转换为 Base64（处理大文件）

console.log('[CRXJS] Hello world from content script!')
async function createFontFace() {
    const fontStyle = document.createElement('style')
    const url = chrome.runtime.getURL('src/assets/material-icons-outlined.woff2')
    console.log(url)
    fontStyle.textContent = `
        .material-icons-outlined {
            font-family: "Material Icons Outlined";
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-feature-settings: "liga";
        }
        @font-face {
            font-family: "Material Icons Outlined";
            font-style: normal;
            font-weight: 400;
            font-display: block;
            src: url("${chrome.runtime.getURL('src/assets/material-icons-outlined.woff2')}") format('woff2');
        }
    `

    return fontStyle
}

// 创建容器和 Shadow DOM
const container = document.createElement('div')
container.id = 'crxjs-app'
const shadowRoot = container.attachShadow({ mode: 'open' })

// 创建挂载点
const mountPoint = document.createElement('div')
shadowRoot.appendChild(mountPoint)
const fontStyle = await createFontFace()
document.head.appendChild(fontStyle)
const style = document.createElement('style')
style.textContent = css
shadowRoot.appendChild(style)

// 添加到页面并挂载应用
document.body.appendChild(container)
const app = createApp(App)
app.mount(mountPoint)
