import React, { useRef } from 'react'
import styled from 'styled-components/native'

import { VenueMapLabel } from 'features/venueMap/components/VenueMapLabel/VenueMapLabel'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTypeIconName } from 'features/venueMap/helpers/getVenueTypeIconName/getVenueTypeIconName'
import { Marker as MarkerOriginal, MapMarkerProps, MapMarker } from 'libs/maps/maps'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'

import { MARKER_SIZE } from '../../../constant'

const PIN_MAX_Z_INDEX = 10_000

interface MarkerProps extends MapMarkerProps {
  venue: GeolocatedVenue
  isSelected: boolean
  showLabel: boolean
}
export const Marker = ({ venue, isSelected, showLabel, ...otherProps }: MarkerProps) => {
  const markerRef = useRef<MapMarker>(null)
  return (
    <CustomMarker
      ref={markerRef}
      identifier={venue.venueId.toString()}
      anchor={{ x: 0.5, y: showLabel ? 0.6 : 1 }}
      tracksViewChanges={false}
      testID={`marker-${venue.venueId}`}
      zIndex={isSelected ? PIN_MAX_Z_INDEX : undefined}
      {...otherProps}>
      <MarkerImage
        url={getVenueTypeIconName(isSelected, venue.venue_type)}
        onLoad={() => {
          markerRef.current?.redraw()
        }}
      />
      {showLabel ? <VenueMapLabel venue={venue} /> : null}
    </CustomMarker>
  )
}

const CustomMarker = styled(MarkerOriginal)({
  alignItems: 'center',
})

const MarkerImage = styled(FastImage)({
  width: MARKER_SIZE.width,
  height: MARKER_SIZE.height,
})
