import { MailSuggestion } from '@zootools/email-spell-checker/dist/lib/types'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer } from 'ui/theme'

type Props = {
  suggestedEmail?: MailSuggestion
  onSpellingHelpPress?: () => void
  onEmailChange: (email: string) => void
}

export const SpellingHelp = ({ suggestedEmail, onEmailChange, onSpellingHelpPress }: Props) => {
  const [showBanner, setShowBanner] = useState(false)

  if (suggestedEmail) setShowBanner(true)

  const replaceEmail = useCallback(() => {
    setShowBanner(false)
    onSpellingHelpPress?.()
    if (suggestedEmail) onEmailChange(suggestedEmail.full)
  }, [onEmailChange, onSpellingHelpPress, suggestedEmail])

  if (!showBanner || !suggestedEmail) return null

  const emailMessage = `Veux-tu plutôt dire ${suggestedEmail.address}@${suggestedEmail.domain}\u00a0?`

  return (
    <Container>
      <Spacer.Column numberOfSpaces={2} />
      <InfoBanner message={emailMessage}>
        <Spacer.Column numberOfSpaces={2} />
        <ButtonQuaternarySecondary
          numberOfLines={2}
          justifyContent="flex-start"
          onPress={replaceEmail}
          icon={PlainArrowNext}
          wording="Appliquer la modification"
          inline
        />
      </InfoBanner>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  maxWidth: theme.forms.maxWidth,
}))
