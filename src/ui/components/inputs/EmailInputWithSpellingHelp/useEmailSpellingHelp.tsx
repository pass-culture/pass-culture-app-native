import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'

import { useDebounce } from 'ui/hooks/useDebounce'

import { suggestEmail } from './suggestEmail'

type Props = {
  email?: string
}

type SuggestedEmail = {
  suggestedEmail: MailSuggestion | undefined
}

export const SUGGESTION_DELAY_IN_MS = 600

export const useEmailSpellingHelp = ({ email }: Props): SuggestedEmail => {
  const suggestedEmail = useDebounce(
    email ? suggestEmail(email) : undefined,
    SUGGESTION_DELAY_IN_MS
  )
  return { suggestedEmail }
}
