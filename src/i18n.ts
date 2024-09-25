import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import de from './locales/de.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import it from './locales/it.json'

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  de: { translation: de },
  it: { translation: it },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['it', 'en', 'fr', 'de'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3',
  })

export default i18n
