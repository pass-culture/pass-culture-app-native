import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'
import React from 'react'
import styled from 'styled-components/native'

import { Banner } from 'ui/components/Banner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer } from 'ui/theme'

type Props = {
  suggestedEmail: MailSuggestion
  onEmailChange: (email: string) => void
}

export const SpellingHelp = ({ suggestedEmail, onEmailChange }: Props) => {
  function replaceEmail() {
    onEmailChange(suggestedEmail.full)
  }

  return (
    <Container>
      <Banner message={`Veux-tu plutôt dire ${suggestedEmail.address}@${suggestedEmail.domain}`}>
        <Spacer.Column numberOfSpaces={2} />
        <ButtonQuaternarySecondary
          numberOfLines={2}
          justifyContent="flex-start"
          onPress={replaceEmail}
          icon={PlainArrowNext}
          wording="Appliquer la modification"
          inline
        />
      </Banner>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.forms.maxWidth,
}))
