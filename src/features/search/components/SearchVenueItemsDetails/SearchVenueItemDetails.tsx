import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { GUTTER_DP, Typo } from 'ui/theme'

interface SearchVenueItemDetailsProps {
  width: number
  name: string
  shortAddress: string
}

export const SearchVenueItemDetails = ({
  width,
  name,
  shortAddress,
}: SearchVenueItemDetailsProps) => {
  return (
    <Container maxWidth={width}>
      <VenueName>{name}</VenueName>
      <ShortAddressLabel>{shortAddress}</ShortAddressLabel>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))

const VenueName = styled(Typo.BodyAccent).attrs({
  numberOfLines: 2,
})({})

const ShortAddressLabel = styled(Typo.BodyAccentXs).attrs({
  numberOfLines: 2,
})(({ theme }) => ({ flexShrink: 1, color: theme.designSystem.color.text.subtle }))
