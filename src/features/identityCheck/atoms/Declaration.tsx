import React from 'react'
import styled from 'styled-components/native'

import { Quote } from 'ui/svg/icons/Quote'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const Declaration = ({ text, description }: { text: string; description: string }) => {
  return (
    <CenteredContainer>
      <Spacer.Flex />
      <QuoteContainer>
        <Quote size={getSpacing(12)} color={ColorsEnum.GREY_MEDIUM} />
      </QuoteContainer>
      <CenteredText>{text}</CenteredText>
      <QuoteContainer reversed>
        <Quote size={getSpacing(12)} color={ColorsEnum.GREY_MEDIUM} />
      </QuoteContainer>
      <CenteredDescription>{description}</CenteredDescription>
      <Spacer.Flex flex={2} />
    </CenteredContainer>
  )
}

const CenteredContainer = styled.View({ flex: 1, alignItems: 'center', maxWidth: getSpacing(125) })
const CenteredText = styled(Typo.Body)({ textAlign: 'center' })
const CenteredDescription = styled(Typo.Caption)({ textAlign: 'center' })
const QuoteContainer = styled.View<{ reversed?: boolean }>(({ reversed = false }) => ({
  paddingVertical: getSpacing(4),
  transform: reversed ? 'rotate(180deg)' : undefined,
}))
