import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { LayoutChangeEvent, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Venue } from 'features/venue/types'
import { VenueMapCluster } from 'features/venuemap/components/VenueMapCluster/VenueMapCluster'
import { VenueMapPreview } from 'features/venuemap/components/VenueMapPreview/VenueMapPreview'
import { calculateRoundRadiusInKilometers } from 'features/venuemap/helpers/calculateDistanceMap'
import { getVenueTags } from 'features/venuemap/helpers/getVenueTags/getVenueTags'
import { isGeolocValid } from 'features/venuemap/helpers/isGeolocValid'
import { useGetDefaultRegion } from 'features/venuemap/hook/useGetDefautRegion'
import { useGetAllVenues } from 'features/venuemap/useGetAllVenues'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import MapView, { EdgePadding, Marker, Region, MarkerPressEvent, Map } from 'libs/maps/maps'
import { parseType } from 'libs/parsers/venueType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { getSpacing } from 'ui/theme'

type Props = {
  padding: EdgePadding
}

const PREVIEW_HEIGHT_ESTIMATION = 114
const PREVIEW_BOTTOM_MARGIN = getSpacing(10)
const CENTER_PIN_THRESHOLD = getSpacing(4)

type GeolocatedVenue = Omit<Venue, 'venueId'> & {
  _geoloc: { lat: number; lng: number }
  venueId: number
}

export const VenueMapView: FunctionComponent<Props> = ({ padding }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const mapViewRef = useRef<Map>(null)
  const previewHeight = useRef<number>(PREVIEW_HEIGHT_ESTIMATION)

  const { height, width } = useWindowDimensions()
  const headerHeight = useGetHeaderHeight()

  const defaultRegion = useGetDefaultRegion()
  const [selectedVenue, setSelectedVenue] = useState<GeolocatedVenue | null>(null)
  const [currentRegion, setCurrentRegion] = useState<Region>(defaultRegion)
  const [lastRegionSearched, setLastRegionSearched] = useState<Region>(defaultRegion)
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
    onNavigateToVenuePress(venueId)
    navigate('Venue', { id: venueId })
  }

  const centerOnLocation = async (latitude: number, longitude: number) => {
    if (!mapViewRef.current || !previewHeight.current) return

    const region = { ...currentRegion, latitude, longitude }
    const point = await mapViewRef.current.pointForCoordinate({ latitude, longitude })

    const isBehindPreview =
      point.y > height - (PREVIEW_BOTTOM_MARGIN + previewHeight.current + CENTER_PIN_THRESHOLD)
    const isBehindHeader = point.y < headerHeight + CENTER_PIN_THRESHOLD
    const isBehindRightBorder = point.x > width - CENTER_PIN_THRESHOLD
    const isBehindLeftBorder = point.x < CENTER_PIN_THRESHOLD

    if (isBehindHeader || isBehindRightBorder || isBehindPreview || isBehindLeftBorder) {
      mapViewRef.current.animateToRegion(region)
    }
  }

  const handleMarkerPress = (venue: GeolocatedVenue, event: MarkerPressEvent) => {
    // Prevents the onPress of the MapView from being triggered
    event.stopPropagation()
    setShowSearchButton(false)
    if (isPreviewEnabled) {
      setSelectedVenue(venue)
      centerOnLocation(
        event.nativeEvent.coordinate.latitude,
        event.nativeEvent.coordinate.longitude
      )
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
        ref={mapViewRef}
        showsUserLocation
        initialRegion={defaultRegion}
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
            onPress={(event) => handleMarkerPress(venue, event)}
            image={{
              uri: venue.venueId === selectedVenue?.venueId ? 'map_pin_selected' : 'map_pin',
            }}
          />
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
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            previewHeight.current = nativeEvent.layout.height
          }}
        />
      ) : null}
    </React.Fragment>
  )
}

const StyledMapView = styled(MapView)({ height: '100%', width: '100%' })

const ButtonContainer = styled.View<{ top: number }>(({ top }) => ({
  position: 'absolute',
  top: top + getSpacing(4),
  left: getSpacing(13.5),
  right: getSpacing(13.5),
  alignItems: 'center',
}))

const StyledVenueMapPreview = styled(VenueMapPreview)(({ theme }) => ({
  position: 'absolute',
  bottom: PREVIEW_BOTTOM_MARGIN,
  left: getSpacing(4),
  right: getSpacing(4),
  backgroundColor: theme.colors.white,
}))
