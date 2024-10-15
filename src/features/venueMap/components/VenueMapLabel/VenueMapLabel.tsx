import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  venue: GeolocatedVenue
}

const HALF_MARKER_WIDTH = 22
const MARKER_HEIGHT = 45

export const VenueMapLabel: FunctionComponent<Props> = ({ venue }) => {
  const [labelWidth, setLabelWidth] = useState(0)

  const onLabelLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setLabelWidth(width)
  }

  return (
    <LabelContainer testID="label-container" onLayout={onLabelLayout} labelWidth={labelWidth}>
      <Label numberOfLines={1}>{venue.label}</Label>
    </LabelContainer>
  )
}

const Label = styled(TypoDS.BodySemiBoldXs)({
  textAlign: 'center',
})

const LabelContainer = styled.View<{ labelWidth: number }>(({ theme, labelWidth }) => ({
  top: MARKER_HEIGHT,
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.checkbox,
  borderWidth: 0,
  maxWidth: getSpacing(40),
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(1),
  transform: `translateX(${HALF_MARKER_WIDTH - labelWidth / 2}px)`,
}))
