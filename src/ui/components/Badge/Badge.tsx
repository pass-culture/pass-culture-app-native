import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  value: number
  testID?: string
  children?: never
}

export const Badge: FunctionComponent<Props> = ({ value, ...props }) => {
  const { designSystem } = useTheme()
  const BADGE_SIZE = designSystem.size.spacing.l
  return (
    <Container {...props}>
      <Wrapper BADGE_SIZE={BADGE_SIZE}>
        <Caption BADGE_SIZE={BADGE_SIZE}>{value}</Caption>
      </Wrapper>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  alignSelf: 'center',
  borderWidth: getSpacing(0.25),
  borderStyle: 'solid',
  borderColor: theme.designSystem.color.border.inverted,
  borderRadius: theme.designSystem.size.borderRadius.l,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))

const Wrapper = styled.View<{ BADGE_SIZE: number }>(({ BADGE_SIZE, theme }) => ({
  minWidth: BADGE_SIZE,
  minHeight: BADGE_SIZE,
  paddingHorizontal: theme.designSystem.size.spacing.xxs,
}))

const Caption = styled(Typo.BodyAccentXs)<{ BADGE_SIZE: number }>(({ BADGE_SIZE, theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.inverted,
  lineHeight: `${BADGE_SIZE}px`,
}))
