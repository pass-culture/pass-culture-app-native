import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'

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
      <TypoDS.BodyAccentXs>{`${attemptsLeft} demandes`}</TypoDS.BodyAccentXs>
    </StyledCaption>
  )
}

const StyledCaption = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledErrorText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.error,
}))
