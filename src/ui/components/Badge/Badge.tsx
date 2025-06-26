import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

const BADGE_SIZE = getSpacing(4)

type Props = {
  value: number
  testID?: string
  children?: never
}

export const Badge: FunctionComponent<Props> = ({ value, ...props }) => (
  <Container {...props}>
    <Wrapper>
      <Caption>{value}</Caption>
    </Wrapper>
  </Container>
)

const Container = styled.View(({ theme }) => ({
  alignSelf: 'center',
  borderWidth: getSpacing(0.25),
  borderStyle: 'solid',
  borderColor: theme.designSystem.color.border.inverted,
  borderRadius: BADGE_SIZE,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))

const Wrapper = styled.View({
  minWidth: BADGE_SIZE,
  height: BADGE_SIZE,
  paddingHorizontal: getSpacing(0.5),
})

const Caption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.inverted,
  lineHeight: `${BADGE_SIZE}px`,
}))
