import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { GUTTER_DP, Typo } from 'ui/theme'

interface VenueDetailsProps {
  width: number
  name: string
  city?: string | null
  postalCode?: string | null
}

export const VenueDetails = ({ width, name, city, postalCode }: VenueDetailsProps) => {
  return (
    <Container maxWidth={width}>
      <VenueName>{name}</VenueName>
      <Row>
        <TypeLabel>{[city, postalCode].filter(Boolean).join(', ')}</TypeLabel>
      </Row>
    </Container>
  )
}

const Container = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
  position: 'relative',
}))

const VenueName = styled(Typo.BodyAccent).attrs({
  numberOfLines: 2,
})({})

const Row = styled.View({
  flexDirection: 'row',
})

const TypeLabel = styled(Typo.BodyAccentXs).attrs({ numberOfLines: 1 })(({ theme }) => ({
  flexShrink: 1,
  color: theme.designSystem.color.text.subtle,
}))
