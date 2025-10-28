import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { Banner } from 'ui/designSystem/Banner/Banner'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

type Props = {
  suggestedEmail?: MailSuggestion
  onSpellingHelpPress?: () => void
  onEmailChange: (email: string) => void
}

export const SpellingHelp = ({ suggestedEmail, onEmailChange, onSpellingHelpPress }: Props) => {
  const replaceEmail = useCallback(() => {
    onSpellingHelpPress?.()
    if (suggestedEmail) {
      onEmailChange(suggestedEmail.full)
    }
  }, [onEmailChange, onSpellingHelpPress, suggestedEmail])

  if (!suggestedEmail) {
    return null
  }

  const emailMessage = `Veux-tu plutôt dire ${suggestedEmail.address}@${suggestedEmail.domain}\u00a0?`

  return (
    <Container>
      <Banner
        Icon={PlainArrowNext}
        label={emailMessage}
        description="Appliquer la modification"
        onPress={replaceEmail}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.forms.maxWidth,
  marginTop: theme.designSystem.size.spacing.l,
}))
