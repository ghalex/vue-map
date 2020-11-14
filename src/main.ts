import { createApp } from 'vue'
import App from './app.vue'
import router from './router'

import '@/assets/css/main.css'

const start = () => {
  const app = createApp(App)

  app.use(router)
  app.mount('#app')
}

start()
