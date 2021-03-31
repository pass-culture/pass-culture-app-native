import { MessageDescriptor, setupI18n } from '@lingui/core' //@translations
/* PluralProps is provided by @types/lingui__core/select.d.ts therefore we can ignore no-unresolved error */
import { PluralProps } from '@lingui/core/select' // eslint-disable-line import/no-unresolved
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

export function _(id: MessageDescriptor | PluralProps): string {
  return !Object.prototype.hasOwnProperty.call(id, 'one')
    ? i18n._(id as MessageDescriptor)
    : i18n.plural(id as PluralProps)
}
