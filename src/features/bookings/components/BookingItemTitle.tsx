import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
}

export function BookingItemTitle(props: Props) {
  return (
    <TitleContainer>
      <ButtonText>{props.title}</ButtonText>
    </TitleContainer>
  )
}

const ButtonText = styled(Typo.ButtonText).attrs(() => ({
  numberOfLines: 2,
  shrink: true,
}))``

const TitleContainer = styled.View({
  paddingBottom: getSpacing(1),
})
