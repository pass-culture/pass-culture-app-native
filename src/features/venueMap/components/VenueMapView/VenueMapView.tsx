import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { VenueMapCluster } from 'features/venueMap/components/VenueMapCluster/VenueMapCluster'
import { VenueMapPreview } from 'features/venueMap/components/VenueMapPreview/VenueMapPreview'
import { PREVIEW_BOTTOM_MARGIN } from 'features/venueMap/components/VenueMapView/constant'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { getVenueTags } from 'features/venueMap/helpers/getVenueTags/getVenueTags'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import MapView, { Marker, Region, MarkerPressEvent, Map } from 'libs/maps/maps'
import { parseType, VenueTypeCode } from 'libs/parsers/venueType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing } from 'ui/theme'

const VenueTypeIconNameMapping = {
  [VenueTypeCodeKey.ARTISTIC_COURSE]: 'artclasses',
  [VenueTypeCodeKey.CREATIVE_ARTS_STORE]: 'artmaterial',
  [VenueTypeCodeKey.CULTURAL_CENTRE]: 'center',
  [VenueTypeCodeKey.MOVIE]: 'cinema',
  [VenueTypeCodeKey.TRAVELING_CINEMA]: 'cinema',
  [VenueTypeCodeKey.DISTRIBUTION_STORE]: 'culturalStore',
  [VenueTypeCodeKey.GAMES]: 'game',
  [VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE]: 'instrumentstore',
  [VenueTypeCodeKey.BOOKSTORE]: 'library',
  [VenueTypeCodeKey.LIBRARY]: 'library',
  [VenueTypeCodeKey.MUSEUM]: 'museum',
  [VenueTypeCodeKey.CONCERT_HALL]: 'music_live',
  [VenueTypeCodeKey.FESTIVAL]: 'music_live',
  [VenueTypeCodeKey.RECORD_STORE]: 'musicstore',
  [VenueTypeCodeKey.SCIENTIFIC_CULTURE]: 'science',
  [VenueTypeCodeKey.PERFORMING_ARTS]: 'show',
  [VenueTypeCodeKey.PATRIMONY_TOURISM]: 'tourism',
  [VenueTypeCodeKey.VISUAL_ARTS]: 'visualart',
  [VenueTypeCodeKey.DIGITAL]: null,
  [VenueTypeCodeKey.OTHER]: null,
}

const getIconName = (selected: boolean, venueType?: VenueTypeCode) => {
  const suffix = venueType ? VenueTypeIconNameMapping[venueType] : null
  const iconName = suffix ? `map_pin_${suffix}` : 'map_pin'
  if (selected) {
    return `${iconName}_selected`
  }
  return iconName
}

type Props = {
  height: number
}

const PREVIEW_HEIGHT_ESTIMATION = 114

const PIN_MAX_Z_INDEX = 10_000

export const VenueMapView: FunctionComponent<Props> = ({ height }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'VenueMap'>>()
  const [initialVenues, setInitialVenues] = useState(params?.initialVenues)
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const mapViewRef = useRef<Map>(null)
  const previewHeight = useRef<number>(PREVIEW_HEIGHT_ESTIMATION)

  const defaultRegion = useGetDefaultRegion()
  const [selectedVenue, setSelectedVenue] = useState<GeolocatedVenue | null>(null)
  const [currentRegion, setCurrentRegion] = useState<Region>(defaultRegion)
  const [lastRegionSearched, setLastRegionSearched] = useState<Region>(defaultRegion)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)

  const venues = useGetVenuesInRegion(lastRegionSearched, selectedVenue, initialVenues)

  const distanceToVenue = useDistance({
    lat: selectedVenue?._geoloc.lat,
    lng: selectedVenue?._geoloc.lng,
  })
  const venueTypeLabel = parseType(selectedVenue?.venue_type)
  const tags = getVenueTags({ distance: distanceToVenue, venue_type: venueTypeLabel })

  const centerOnLocation = useCenterOnLocation({
    currentRegion,
    previewHeight: previewHeight.current,
    mapViewRef,
    mapHeight: height,
  })

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region)
    setShowSearchButton(true)
  }

  const handleSearchPress = () => {
    setInitialVenues(undefined)
    setLastRegionSearched(currentRegion)
    setShowSearchButton(false)
  }

  const navigateToVenue = (venueId: number) => {
    onNavigateToVenuePress(venueId)
    navigate('Venue', { id: venueId })
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
        rotateEnabled={false}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        renderCluster={(props) => <VenueMapCluster {...props} />}
        onPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        onClusterPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        testID="venue-map-view">
        {venues.map((venue) => (
          <Marker
            key={venue.venueId}
            coordinate={{
              latitude: venue._geoloc.lat,
              longitude: venue._geoloc.lng,
            }}
            onPress={(event) => handleMarkerPress(venue, event)}
            image={{
              uri: getIconName(venue.venueId === selectedVenue?.venueId, venue.venue_type),
            }}
            zIndex={venue.venueId === selectedVenue?.venueId ? PIN_MAX_Z_INDEX : undefined}
          />
        ))}
      </StyledMapView>
      {showSearchButton ? (
        <ButtonContainer>
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

const ButtonContainer = styled.View({
  position: 'absolute',
  top: getSpacing(4),
  left: getSpacing(13.5),
  right: getSpacing(13.5),
  alignItems: 'center',
})

const StyledVenueMapPreview = styled(VenueMapPreview)(({ theme }) => ({
  position: 'absolute',
  bottom: PREVIEW_BOTTOM_MARGIN,
  left: getSpacing(4),
  right: getSpacing(4),
  backgroundColor: theme.colors.white,
}))
