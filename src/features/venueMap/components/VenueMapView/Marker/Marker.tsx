import React from 'react'
import styled from 'styled-components/native'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getActivityIconName } from 'features/venueMap/helpers/getActivityIconName/getActivityIconName'
import { Marker as MapMarker, MapMarkerProps } from 'libs/maps/maps'

import { MARKER_SIZE } from '../../../constant'
import { VenueMapLabel } from '../../VenueMapLabel/VenueMapLabel'

const PIN_MAX_Z_INDEX = 10_000

interface MarkerProps extends MapMarkerProps {
  venue: GeolocatedVenue
  isSelected: boolean
  showLabel: boolean
}

export const Marker = ({ venue, isSelected, showLabel, ...otherProps }: MarkerProps) => (
  <MapMarker
    anchor={{ x: 0.5, y: showLabel ? 0.6 : 1 }}
    testID={`marker-${venue.venueId}${isSelected ? '-selected' : ''}`}
    zIndex={PIN_MAX_Z_INDEX}
    {...otherProps}>
    <MarkerImageView>
      <PinImage source={{ uri: getActivityIconName(isSelected, venue.activity) }} />
      {showLabel ? <VenueMapLabel venue={venue} /> : null}
    </MarkerImageView>
  </MapMarker>
)

const PinImage = styled.Image({
  width: MARKER_SIZE.width,
  height: MARKER_SIZE.height,
  resizeMode: 'contain',
})

const MarkerImageView = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.xs,
}))
