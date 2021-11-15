import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
}

export function BookingItemTitle(props: Props) {
  return (
    <TitleContainer>
      <Typo.ButtonText numberOfLines={2} shrink>
        {props.title}
      </Typo.ButtonText>
    </TitleContainer>
  )
}

const TitleContainer = styled.View({
  flexDirection: 'row',
  flex: 1,
  paddingBottom: getSpacing(1),
})
