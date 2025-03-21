import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
}

export function BookingItemTitle(props: Props) {
  return (
    <TitleContainer>
      <BodyAccent>{props.title}</BodyAccent>
    </TitleContainer>
  )
}

const BodyAccent = styled(Typo.BodyAccent).attrs(() => ({
  numberOfLines: 2,
  shrink: true,
}))``

const TitleContainer = styled.View({
  paddingBottom: getSpacing(1),
})
