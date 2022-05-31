import { i18n, Messages } from '@lingui/core'
import { fr } from 'make-plural/plurals'

i18n.loadLocaleData({
  fr: { plurals: fr },
})

export async function activate(locale: string) {
  // When adding a new language, you can switch on the locale
  const catalog: { messages: Messages } = await import('locales/fr/messages')

  i18n.load(locale, catalog.messages)
  i18n.activate(locale)
}
