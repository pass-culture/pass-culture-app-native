import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getSpacing, TypoDS } from 'ui/theme'

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
  borderColor: theme.colors.white,
  borderRadius: BADGE_SIZE,
  backgroundColor: theme.colors.primary,
}))

const Wrapper = styled.View({
  minWidth: BADGE_SIZE,
  height: BADGE_SIZE,
  paddingHorizontal: getSpacing(0.5),
})

const Caption = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
  lineHeight: `${BADGE_SIZE}px`,
}))
