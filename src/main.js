import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import '@/styles/print.scss' // global css

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
