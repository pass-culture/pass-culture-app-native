import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

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
        Attention, il te reste&nbsp;:{SPACE}
        <StyledErrorText {...setTextSemantic('span')}>{`${attemptsLeft} demande`}</StyledErrorText>
      </StyledCaption>
    )
  }
  return (
    <StyledCaption>
      Attention, il te reste&nbsp;:{SPACE}
      <Typo.BodyAccentXs
        {...setTextSemantic('span')}>{`${attemptsLeft} demandes`}</Typo.BodyAccentXs>
    </StyledCaption>
  )
}

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledErrorText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
}))
