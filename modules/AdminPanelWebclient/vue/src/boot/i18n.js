import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'

import messages from 'src/i18n'

const loadedLanguages = ['en']

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  lazy: true,
  messages,
})

function setI18nLanguage(lang) {
  i18n.global.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang) {
  if (i18n.global.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  return import('../i18n/' + lang + '/index.json').then((messages) => {
    i18n.global.setLocaleMessage(lang, messages.default)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}

export default boot(({ app }) => {
  app.use(i18n)
})
