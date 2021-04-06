import { i18n, Messages } from '@lingui/core'
import { fr } from 'make-plural/plurals'

i18n.loadLocaleData({
  fr: { plurals: fr },
})

export async function activate(locale: string) {
  let catalog: { messages: Messages }

  switch (locale) {
    case 'fr':
    default:
      catalog = await import('locales/fr/messages')
      break
  }

  i18n.load(locale, catalog.messages)
  i18n.activate(locale)
}
