import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { parseTypeHomeLabel, VenueTypeCode } from 'libs/parsers'
import { Typo, GUTTER_DP } from 'ui/theme'

interface VenueDetailsProps {
  width: number
  name: string
  venueType: VenueTypeCode | null
  distance?: string
}

export const VenueDetails = (props: VenueDetailsProps) => {
  const { width, name, venueType, distance } = props
  const typeLabel = parseTypeHomeLabel(venueType)

  return (
    <Container maxWidth={width}>
      <VenueName>{name}</VenueName>
      <Row>
        <TypeLabel>{typeLabel}</TypeLabel>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        {!!distance && <Distance>{` | ${distance}`}</Distance>}
      </Row>
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

const Row = styled.View({
  flexDirection: 'row',
})

const TypeLabel = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})(({ theme }) => ({ flexShrink: 1, color: theme.colors.greyDark }))

const Distance = styled(Typo.Caption)(({ theme }) => ({ color: theme.colors.greyDark }))
