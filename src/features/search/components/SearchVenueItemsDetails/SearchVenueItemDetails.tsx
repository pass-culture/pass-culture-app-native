import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP } from 'ui/theme'

interface SearchVenueItemDetailsProps {
  width: number
  height: number
  name: string
  shortAddress: string
}

export const SearchVenueItemDetails = ({
  width,
  height,
  name,
  shortAddress,
}: SearchVenueItemDetailsProps) => {
  return (
    <Container maxWidth={width} minHeight={height}>
      <VenueName>{name}</VenueName>
      <ShortAddressLabel>{shortAddress}</ShortAddressLabel>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number; minHeight: number }>(
  ({ maxWidth, minHeight }) => ({
    maxWidth,
    marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
    minHeight,
  })
)

const VenueName = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
})({})

const ShortAddressLabel = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})(({ theme }) => ({ flexShrink: 1, color: theme.colors.greyDark }))
