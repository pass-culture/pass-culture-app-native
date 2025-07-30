import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type IntroductionProps = {
  title: string
  paragraph: string
}

export const Introduction = ({ title, paragraph }: IntroductionProps) => (
  <React.Fragment>
    <IntroductionContainer gap={4}>
      <Typo.Title4 numberOfLines={3}>{title}</Typo.Title4>
      <Typo.Body>{paragraph}</Typo.Body>
    </IntroductionContainer>
    <Divider />
  </React.Fragment>
)

const IntroductionContainer = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const Divider = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xs,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.xl,
}))
