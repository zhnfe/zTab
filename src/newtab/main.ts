import { createApp } from 'vue'
import App from './Newtab.vue'
import '@/index.css'
import '@/store'
import '@/utils/theme'
import './new-tab.css'

const app = createApp(App)
app.mount('#app')
