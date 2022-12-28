import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'
import React from 'react'

import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo } from 'ui/theme'

type Props = {
  suggestedEmail: MailSuggestion
  onEmailChange: (email: string) => void
}

export const SpellingHelp = ({ suggestedEmail, onEmailChange }: Props) => {
  const replaceEmail = () => {
    onEmailChange(suggestedEmail.full)
  }

  return (
    <Touchable onPress={replaceEmail}>
      <Typo.Caption>
        {suggestedEmail.address}@<Typo.ButtonText>{suggestedEmail.domain}</Typo.ButtonText>
      </Typo.Caption>
    </Touchable>
  )
}
