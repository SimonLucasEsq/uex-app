/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import { plainAxiosInstance, securedAxiosInstance } from '@/plugins/axios'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueAxios from 'vue-axios'

loadFonts()


// Create vue app
const app = createApp(App)


// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance,
})

// Mount vue app
app.mount('#app')
