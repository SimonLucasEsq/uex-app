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

import Toast from "vue-toastification"

// Import the CSS or use your own!
import "vue-toastification/dist/index.css"
import i18n from "@/i18n"

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

const toastOptions = {
  // You can set your default options here
}

app.use(Toast, toastOptions)
app.use(i18n)

// Mount vue app
app.mount('#app')
