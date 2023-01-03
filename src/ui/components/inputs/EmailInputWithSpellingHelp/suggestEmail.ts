import emailSpellChecker from '@zootools/email-spell-checker'
import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'

import { emailSchema } from 'features/auth/signup/SetEmail/schema/emailSchema'

const TOP_MOST_USED_DOMAINS = [
  'gmail.com',
  'icloud.com',
  'hotmail.com',
  'hotmail.fr',
  'outlook.com',
  'yahoo.com',
  'orange.fr',
  'laposte.net',
  'free.fr',
  'sfr.fr',
]

const config = {
  domainThreshold: 4,
  domains: TOP_MOST_USED_DOMAINS,
  secondLevelDomains: [],
  topLevelDomains: [],
}

export const suggestEmail = (email: string): MailSuggestion | undefined => {
  const isEmailValid = emailSchema.isValidSync(email)

  if (!isEmailValid) {
    return undefined
  }

  return emailSpellChecker.run({ ...config, email })
}
