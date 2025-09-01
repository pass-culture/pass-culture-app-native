import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { Size } from 'features/venueMap/types'
import { Typo } from 'ui/theme'

import { LabelContainer } from './LabelContainer'

type Props = {
  venue: GeolocatedVenue
}

export const VenueMapLabel: FunctionComponent<Props> = ({ venue }) => {
  const [labelSize, setLabelSize] = useState<Size>({ width: 0, height: 0 })

  const onLabelLayout = (event: LayoutChangeEvent) => {
    setLabelSize(event.nativeEvent.layout)
  }

  return (
    <LabelContainer testID="label-container" onLayout={onLabelLayout} labelSize={labelSize}>
      <Typo.BodyAccentXs numberOfLines={1}>{venue.label}</Typo.BodyAccentXs>
    </LabelContainer>
  )
}
