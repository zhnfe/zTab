import { createApp } from 'vue'
import css from '@/index.css?inline'
import App from './App.vue'
import '@/store'

console.info('ztab...')

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
