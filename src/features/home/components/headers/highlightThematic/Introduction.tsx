import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

type IntroductionProps = {
  title: string
  paragraph: string
}

export const Introduction = ({ title, paragraph }: IntroductionProps) => (
  <React.Fragment>
    <IntroductionContainer>
      <Typo.Title4 numberOfLines={3}>{title}</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>{paragraph}</Typo.Body>
    </IntroductionContainer>
    <Spacer.Column numberOfSpaces={6} />
    <Divider />
    <Spacer.Column numberOfSpaces={6} />
  </React.Fragment>
)

const IntroductionContainer = styled.View({
  paddingHorizontal: getSpacing(6),
})

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(1),
  backgroundColor: theme.colors.greyLight,
}))
