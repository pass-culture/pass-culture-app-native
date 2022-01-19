import React from 'react'
import styled from 'styled-components/native'

import { Quote } from 'ui/svg/icons/Quote'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const Declaration = ({ text, description }: { text: string; description: string }) => {
  return (
    <CenteredContainer>
      <QuoteContainer>
        <Quote size={getSpacing(12)} color={ColorsEnum.GREY_MEDIUM} />
      </QuoteContainer>
      <CenteredText>{text}</CenteredText>
      <QuoteContainer reversed>
        <Quote size={getSpacing(12)} color={ColorsEnum.GREY_MEDIUM} />
      </QuoteContainer>
      <CenteredDescription>{description}</CenteredDescription>
    </CenteredContainer>
  )
}

const CenteredContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  maxWidth: theme.desktopCenteredContentMaxWidth,
}))

const CenteredText = styled(Typo.Body)({ textAlign: 'center' })

const CenteredDescription = styled(Typo.Caption)({ textAlign: 'center' })

const QuoteContainer = styled.View<{ reversed?: boolean }>(({ reversed = false }) => ({
  paddingVertical: getSpacing(4),
  transform: reversed ? 'rotate(180deg)' : undefined,
}))
