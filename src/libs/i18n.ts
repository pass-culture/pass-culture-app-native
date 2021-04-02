import { MessageDescriptor, MessageOptions, setupI18n } from '@lingui/core' //@translations
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

export function _(
  id: MessageDescriptor | string,
  values?: Record<string, unknown>,
  messageOptions?: MessageOptions
): string {
  if (typeof id === 'string') {
    return i18n._(id, values, messageOptions)
  }
  return i18n._(id as MessageDescriptor)
}
