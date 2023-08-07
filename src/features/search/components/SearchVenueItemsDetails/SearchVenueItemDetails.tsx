import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP } from 'ui/theme'

interface SearchVenueItemDetailsProps {
  width: number
  name: string
  city: string
}

export const SearchVenueItemDetails = ({ width, name, city }: SearchVenueItemDetailsProps) => {
  return (
    <Container maxWidth={width}>
      <VenueName>{name}</VenueName>
      <CityLabel>{city}</CityLabel>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))

const VenueName = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
})({})

const CityLabel = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})(({ theme }) => ({ flexShrink: 1, color: theme.colors.greyDark }))
