/* From:
   - https://www.youtube.com/watch?v=vKyvItjJhQI
   - https://github.com/intlify/vue-i18n-next/issues/904
*/
import { createI18n } from "vue-i18n"
import es from "@/locales/es.json"
import en from "@/locales/en.json"

function loadLocaleMessages() {
  const locales = [{ en: en }, { es: es }]
  const messages = {}

  locales.forEach(lang => {
    const key = Object.keys(lang)

    messages[key] = lang[key]
  })

  return messages
}

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  globalInjection: true,
  messages: loadLocaleMessages(),
})

export default i18n
