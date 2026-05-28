import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
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
  const numberOfLines = useNumberOfLine(2)

  return (
    <Container maxWidth={width}>
      <VenueName numberOfLines={numberOfLines}>{name}</VenueName>
      <ShortAddressLabel numberOfLines={numberOfLines}>{shortAddress}</ShortAddressLabel>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))

const VenueName = styled(Typo.BodyAccent).attrs(({ numberOfLines }) => ({
  numberOfLines,
}))({})

const ShortAddressLabel = styled(Typo.BodyAccentXs).attrs(({ numberOfLines }) => ({
  numberOfLines,
}))(({ theme }) => ({ flexShrink: 1, color: theme.designSystem.color.text.subtle }))
