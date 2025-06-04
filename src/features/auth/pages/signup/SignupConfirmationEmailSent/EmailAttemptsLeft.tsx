import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

interface Props {
  attemptsLeft?: number
}

export const EmailAttemptsLeft: FunctionComponent<Props> = ({ attemptsLeft }) => {
  if (attemptsLeft === undefined) {
    return null
  }

  if (attemptsLeft < 2) {
    return (
      <StyledCaption>
        Attention, il te reste&nbsp;: <StyledErrorText>{`${attemptsLeft} demande`}</StyledErrorText>
      </StyledCaption>
    )
  }
  return (
    <StyledCaption>
      Attention, il te reste&nbsp;:{' '}
      <Typo.BodyAccentXs>{`${attemptsLeft} demandes`}</Typo.BodyAccentXs>
    </StyledCaption>
  )
}

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledErrorText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
}))
