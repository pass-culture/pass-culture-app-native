import React, { FunctionComponent, useCallback, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Venue } from 'features/venue/types'
import {
  calculateHorizontalDistance,
  calculateRoundRadiusInKilometers,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venuemap/helpers/calculateDistanceMap'
import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
import { useLocation } from 'libs/location'
import MapView, { EdgePadding, Marker, Region } from 'libs/maps/maps'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  padding: EdgePadding
}

const RADIUS_IN_METERS = 10000

type GeolocatedVenue = Venue & {
  _geoloc: { lat: number; lng: number }
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  const { userLocation } = useLocation()

  const { height, width } = useWindowDimensions()
  const screenRatio = height / width
  const { top } = useCustomSafeInsets()

  const verticalDistanceInMeters = calculateVerticalDistance(RADIUS_IN_METERS, screenRatio)
  const horizontalDistanceInMeters = calculateHorizontalDistance(RADIUS_IN_METERS, screenRatio)

  const latitudeDelta = distanceToLatitudeDelta(verticalDistanceInMeters)
  const longitudeDelta = distanceToLongitudeDelta(
    horizontalDistanceInMeters,
    userLocation?.latitude ?? 0
  )

  const defaultCoordinates: Region = {
    latitude: userLocation?.latitude ?? 0,
    longitude: userLocation?.longitude ?? 0,
    latitudeDelta,
    longitudeDelta,
  }

  const [currentRegion, setCurrentRegion] = useState<Region>(defaultCoordinates)
  const [lastRegionSearched, setLastRegionSearched] = useState<Region>(defaultCoordinates)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const radius = calculateRoundRadiusInKilometers(lastRegionSearched)

  const { data: venues = [] } = useGetAllVenues({ region: lastRegionSearched, radius })
  const geolocatedVenues = venues.filter(
    (venue): venue is GeolocatedVenue => !!(venue._geoloc?.lat && venue._geoloc.lng)
  )

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      setCurrentRegion(region)
      setShowSearchButton(true)
    },
    [setCurrentRegion, setShowSearchButton]
  )

  const handleSearchPress = useCallback(() => {
    setLastRegionSearched(currentRegion)
    setShowSearchButton(false)
  }, [currentRegion, setLastRegionSearched, setShowSearchButton])

  const handleMarkerPress = useCallback(() => {
    setShowSearchButton(false)
  }, [setShowSearchButton])

  return (
    <React.Fragment>
      <StyledMapView
        showsUserLocation
        initialRegion={defaultCoordinates}
        mapPadding={padding}
        rotateEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        testID="venue-map-view">
        {geolocatedVenues.map((venue) => (
          <Marker
            key={venue.venueId}
            coordinate={{
              latitude: venue._geoloc.lat,
              longitude: venue._geoloc.lng,
            }}
            onPress={handleMarkerPress}
          />
        ))}
      </StyledMapView>
      {showSearchButton ? (
        <ButtonContainer top={top}>
          <ButtonWrapper>
            <ButtonPrimary wording="Rechercher dans cette zone" onPress={handleSearchPress} />
          </ButtonWrapper>
        </ButtonContainer>
      ) : null}
    </React.Fragment>
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })

const ButtonContainer = styled.View<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top: top + getSpacing(16),
  left: 0,
  right: 0,
  alignItems: 'center',
}))

const ButtonWrapper = styled.View({
  justifyContent: 'center',
})
