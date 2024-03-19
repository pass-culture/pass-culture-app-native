import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Venue } from 'features/venue/types'
import { VenueMapCluster } from 'features/venuemap/components/VenueMapCluster/VenueMapCluster'
import { VenueMapPreview } from 'features/venuemap/components/VenueMapPreview/VenueMapPreview'
import {
  calculateHorizontalDistance,
  calculateRoundRadiusInKilometers,
  calculateVerticalDistance,
  distanceToLatitudeDelta,
  distanceToLongitudeDelta,
} from 'features/venuemap/helpers/calculateDistanceMap'
import { getVenueTags } from 'features/venuemap/helpers/getVenueTags/getVenueTags'
import { isGeolocValid } from 'features/venuemap/helpers/isGeolocValid'
import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import MapView, { EdgePadding, Marker, Region, MarkerPressEvent } from 'libs/maps/maps'
import { parseType } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { MapPin } from 'ui/svg/icons/MapPin'
import { getSpacing } from 'ui/theme'

type Props = {
  padding: EdgePadding
}

const RADIUS_IN_METERS = 10_000

type GeolocatedVenue = Omit<Venue, 'venueId'> & {
  _geoloc: { lat: number; lng: number }
  venueId: number
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  const { userLocation } = useLocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)

  const { height, width } = useWindowDimensions()
  const screenRatio = height / width
  const headerHeight = useGetHeaderHeight()

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

  const [selectedVenue, setSelectedVenue] = useState<GeolocatedVenue | null>(null)
  const [currentRegion, setCurrentRegion] = useState<Region>(defaultCoordinates)
  const [lastRegionSearched, setLastRegionSearched] = useState<Region>(defaultCoordinates)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const radius = calculateRoundRadiusInKilometers(lastRegionSearched)

  const { data: venues = [] } = useGetAllVenues({ region: lastRegionSearched, radius })
  const geolocatedVenues = venues.filter(
    (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
  )
  const distanceToVenue = useDistance({
    lat: selectedVenue?._geoloc.lat,
    lng: selectedVenue?._geoloc.lng,
  })

  const venueTypeLabel = parseType(selectedVenue?.venue_type)

  const tags = getVenueTags({ distance: distanceToVenue, venue_type: venueTypeLabel })

  const hasSelectionOutsideSearchArea =
    selectedVenue && !geolocatedVenues.find((venue) => venue.venueId === selectedVenue.venueId)

  if (hasSelectionOutsideSearchArea) {
    geolocatedVenues.push(selectedVenue)
  }

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region)
    setShowSearchButton(true)
  }

  const handleSearchPress = () => {
    setLastRegionSearched(currentRegion)
    setShowSearchButton(false)
  }

  const navigateToVenue = (venueId: number) => {
    analytics.logConsultVenue({ venueId, from: 'venueMap' })
    navigate('Venue', { id: venueId })
  }

  const handleMarkerPress = (venue: GeolocatedVenue, event: MarkerPressEvent) => {
    // Prevents the onPress of the MapView from being triggered
    event.stopPropagation()
    setShowSearchButton(false)
    if (isPreviewEnabled) {
      setSelectedVenue(venue)
    } else {
      navigateToVenue(venue.venueId)
    }
  }

  const handlePressOutOfVenuePin = () => {
    if (selectedVenue) {
      setSelectedVenue(null)
    }
  }

  const handlePreviewClose = () => {
    setSelectedVenue(null)
  }

  const onNavigateToVenuePress = (venueId: number) => {
    analytics.logConsultVenue({ venueId, from: 'venueMap' })
  }

  // use formatFullAddressStartsWithPostalCode when we have the param address from Algolia
  const address = `${selectedVenue?.info}, ${selectedVenue?.postalCode}`

  return (
    <React.Fragment>
      <StyledMapView
        showsUserLocation
        initialRegion={defaultCoordinates}
        mapPadding={padding}
        rotateEnabled={false}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        renderCluster={(props) => <VenueMapCluster {...props} />}
        onPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        onClusterPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        testID="venue-map-view">
        {geolocatedVenues.map((venue) => (
          <Marker
            key={venue.venueId}
            coordinate={{
              latitude: venue._geoloc.lat,
              longitude: venue._geoloc.lng,
            }}
            onPress={(event) => handleMarkerPress(venue, event)}>
            <StyledMapPin isSelected={venue.venueId === selectedVenue?.venueId} />
          </Marker>
        ))}
      </StyledMapView>
      {showSearchButton ? (
        <ButtonContainer top={headerHeight}>
          <ButtonPrimary wording="Rechercher dans cette zone" onPress={handleSearchPress} />
        </ButtonContainer>
      ) : null}
      {selectedVenue ? (
        <StyledVenueMapPreview
          venueName={selectedVenue?.label}
          address={address}
          bannerUrl={selectedVenue?.banner_url ?? ''}
          tags={tags}
          navigateTo={{ screen: 'Venue', params: { id: selectedVenue.venueId } }}
          onClose={handlePreviewClose}
          onBeforeNavigate={() => onNavigateToVenuePress(selectedVenue.venueId)}
        />
      ) : null}
    </React.Fragment>
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })

const StyledMapPin = styled(MapPin).attrs<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  color: isSelected ? theme.colors.greyMedium : theme.colors.black,
}))<{ isSelected: boolean }>``

const ButtonContainer = styled.View<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top: top + getSpacing(4),
  left: getSpacing(13.5),
  right: getSpacing(13.5),
  alignItems: 'center',
}))

const StyledVenueMapPreview = styled(VenueMapPreview)(({ theme }) => ({
  position: 'absolute',
  bottom: getSpacing(10),
  left: getSpacing(4),
  right: getSpacing(4),
  backgroundColor: theme.colors.white,
}))
