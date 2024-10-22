import React from 'react'
import styled from 'styled-components/native'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTypeIconName } from 'features/venueMap/helpers/getVenueTypeIconName/getVenueTypeIconName'
import { Marker as MapMarker, MapMarkerProps } from 'libs/maps/maps'

import { VenueMapLabel } from '../../VenueMapLabel/VenueMapLabel'
import { MARKER_SIZE } from '../constant'

const PIN_MAX_Z_INDEX = 10_000

interface MarkerProps extends MapMarkerProps {
  venue: GeolocatedVenue
  isSelected?: boolean
  showLabel?: boolean
}
export const Marker = ({
  venue,
  isSelected = false,
  showLabel = false,
  ...otherProps
}: MarkerProps) => {
  return (
    <CustomMarker
      image={{
        uri: getVenueTypeIconName(isSelected, venue.venue_type),
      }}
      testID={`marker-${venue.venueId}`}
      zIndex={isSelected ? PIN_MAX_Z_INDEX : undefined}
      {...otherProps}>
      {showLabel ? <VenueMapLabel venue={venue} /> : null}
    </CustomMarker>
  )
}

const CustomMarker = styled(MapMarker)({
  minWidth: MARKER_SIZE.width,
  height: MARKER_SIZE.height,
  width: 'auto',
})
