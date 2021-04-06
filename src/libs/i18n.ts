import { i18n } from '@lingui/core'
import { fr } from 'make-plural/plurals'

i18n.loadLocaleData({
  fr: { plurals: fr },
})

export const activate = async (locale: string) => {
  const { messages } = await import(`../locales/${locale}/messages`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}
