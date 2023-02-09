import React from 'react'
import styled from 'styled-components/native'

import { Quote as DefaultQuote } from 'ui/svg/icons/Quote'
import { getSpacing, Typo } from 'ui/theme'
export const Declaration = ({ text, description }: { text: string; description: string }) => {
  return (
    <CenteredContainer>
      <QuoteContainer>
        <Quote />
      </QuoteContainer>
      <CenteredText>{text}</CenteredText>
      <QuoteContainer reversed>
        <Quote />
      </QuoteContainer>
      <CenteredDescription>{description}</CenteredDescription>
    </CenteredContainer>
  )
}

const Quote = styled(DefaultQuote).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  size: theme.icons.sizes.standard,
}))``

const CenteredContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  maxWidth: theme.contentPage.maxWidth,
}))

const CenteredText = styled(Typo.Body)({ textAlign: 'center' })

const CenteredDescription = styled(Typo.Caption)({ textAlign: 'center' })

const QuoteContainer = styled.View<{ reversed?: boolean }>(({ reversed = false }) => ({
  paddingVertical: getSpacing(4),
  transform: reversed ? 'rotate(180deg)' : undefined,
}))
