import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import {
  calculateHorizontalDistance,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venuemap/helpers/calculateDistanceMap'
import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
import { useLocation } from 'libs/location'
import MapView, { EdgePadding, Marker } from 'libs/maps/maps'

type Props = {
  padding: EdgePadding
}

const RADIUS_IN_METERS = 10000

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  const { data: venues = [] } = useGetAllVenues()
  const { userLocation } = useLocation()

  const { height, width } = useWindowDimensions()
  const screenRatio = height / width

  const verticalDistanceInMeters = calculateVerticalDistance(RADIUS_IN_METERS, screenRatio)
  const horizontalDistanceInMeters = calculateHorizontalDistance(RADIUS_IN_METERS, screenRatio)

  const latitudeDelta = distanceToLatitudeDelta(verticalDistanceInMeters)
  const longitudeDelta = distanceToLongitudeDelta(
    horizontalDistanceInMeters,
    userLocation?.latitude ?? 0
  )

  const defaultCoordinates = {
    latitude: userLocation?.latitude ?? 0,
    longitude: userLocation?.longitude ?? 0,
    latitudeDelta,
    longitudeDelta,
  }

  return (
    <StyledMapView showsUserLocation initialRegion={defaultCoordinates} mapPadding={padding}>
      {venues.map((venue) => (
        <React.Fragment key={venue.venueId}>
          {venue._geoloc?.lat && venue._geoloc.lng ? (
            <Marker
              coordinate={{
                latitude: venue._geoloc.lat,
                longitude: venue._geoloc.lng,
              }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </StyledMapView>
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })
