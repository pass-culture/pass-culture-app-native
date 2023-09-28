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
      Attention, il te reste&nbsp;: <StyledInfoText>{`${attemptsLeft} demandes`}</StyledInfoText>
    </StyledCaption>
  )
}

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledInfoText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.black,
}))

const StyledErrorText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.error,
}))
