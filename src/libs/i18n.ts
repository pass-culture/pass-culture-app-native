import { setupI18n } from '@lingui/core' //@translations
import { findBestAvailableLanguage } from 'react-native-localize'

import frenchCatalog from 'locales/fr/messages'

const fallbackLanguageTag = 'fr'

const availableTags = [fallbackLanguageTag]

const languageSettings = findBestAvailableLanguage(availableTags)

export const i18n = setupI18n({
  language: languageSettings?.languageTag || fallbackLanguageTag,
  catalogs: {
    fr: frenchCatalog,
  },
})
