import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

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
  ...getHeadingAttrs(3),
}))``

const TitleContainer = styled.View({
  flexDirection: 'row',
  flex: 1,
  paddingBottom: getSpacing(1),
})
