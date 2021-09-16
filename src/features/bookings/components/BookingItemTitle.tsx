import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
}

export function BookingItemTitle(props: Props) {
  return (
    <TitleContainer>
      <Title numberOfLines={2}>{props.title}</Title>
    </TitleContainer>
  )
}

const TitleContainer = styled.View({
  flexDirection: 'row',
  flex: 1,
  paddingBottom: getSpacing(1),
})

export const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})
