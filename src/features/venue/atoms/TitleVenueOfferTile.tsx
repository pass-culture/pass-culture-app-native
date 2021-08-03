import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, MARGIN_DP } from 'ui/theme'

export const TitleVenueOfferTile = (props: { title: string }) => {
  const { title } = props
  return (
    <Container>
      <Typo.Title4>{title}</Typo.Title4>
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: PixelRatio.roundToNearestPixel(MARGIN_DP),
})
