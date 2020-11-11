import { MessageDescriptor, setupI18n } from '@lingui/core' //@translations
import { t } from '@lingui/macro'
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

export function _(id: MessageDescriptor): string {
  return i18n._(id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function __(strings: TemplateStringsArray, ...values: any[]): string {
  return i18n._(t(strings, ...values))
}
