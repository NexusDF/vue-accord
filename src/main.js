import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import '@/assets/main.css'
import App from './App.vue'
import router from './router'
import { useCatalogStore } from '@/stores/catalog'

registerSW({ immediate: true })

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

useCatalogStore(pinia).bootstrap().catch(() => {
  /* ошибка показывается в CatalogSyncBar */
})
