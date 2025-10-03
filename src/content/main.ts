import { createApp } from 'vue'
import css from '@/index.css?inline'
import fontUrl from '@/assets/material-icons-outlined.woff2'
import App from './App.vue'
import '@/store'

console.log('[CRXJS] Hello world from content script!)')

// 动态创建的link标签不能自动引入 @fontface 引入的字体文件，需要手动加载
const font = new FontFace('Material Icons Outlined', `url(${chrome.runtime.getURL(fontUrl)})`)
font.load().then(() => document.fonts.add(font)).catch(e => console.log(e))

const container = document.createElement('div')
container.id = 'crxjs-app'
const shadowRoot = container.attachShadow({ mode: 'open' })
document.body.appendChild(container)

// import tailwindcss
const style = document.createElement('style')
style.textContent = css
shadowRoot.appendChild(style)

const mountPoint = document.createElement('div')
shadowRoot.appendChild(mountPoint)
const app = createApp(App)
app.mount(mountPoint)
