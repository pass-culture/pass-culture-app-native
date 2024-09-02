import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueMapBottomSheet } from 'features/venueMap/components/VenueMapBottomSheet/VenueMapBottomSheet'
import { VenueMapCluster } from 'features/venueMap/components/VenueMapCluster/VenueMapCluster'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { transformGeoLocatedVenueToVenueResponse } from 'features/venueMap/helpers/geoLocatedVenueToVenueResponse/geoLocatedVenueToVenueResponse'
import { getVenueTypeIconName } from 'features/venueMap/helpers/getVenueTypeIconName/getVenueTypeIconName'
import { zoomOutIfMapEmpty } from 'features/venueMap/helpers/zoomOutIfMapEmpty'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackSessionDuration'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import MapView, { Map, Marker, MarkerPressEvent, Region } from 'libs/maps/maps'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LENGTH_L, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  height: number
  from: string
  venues: GeolocatedVenue[]
  selectedVenue: GeolocatedVenue | null
  venueTypeCode: string | null
  setSelectedVenue: (venue: GeolocatedVenue) => void
  removeSelectedVenue: () => void
  currentRegion: Region
  setCurrentRegion: (region: Region) => void
  setLastRegionSearched: (region: Region) => void
  playlistType: PlaylistType
}

const PIN_MAX_Z_INDEX = 10_000

export const VenueMapView: FunctionComponent<Props> = ({
  height,
  from,
  venues,
  selectedVenue,
  venueTypeCode,
  setSelectedVenue,
  removeSelectedVenue,
  currentRegion,
  setCurrentRegion,
  setLastRegionSearched,
  playlistType,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { tabBarHeight } = useCustomSafeInsets()
  const { bottom } = useSafeAreaInsets()

  const { setInitialVenues } = useInitialVenuesActions()
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const bottomSheetOffersEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET
  )
  const mapViewRef = useRef<Map>(null)

  const defaultRegion = useGetDefaultRegion()

  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const hasSearchButton = from === 'venueMap' ? showSearchButton : false
  const [mapReady, setMapReady] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  const filteredVenues = venueTypeCode
    ? venues.filter((venue) => venue.venue_type === venueTypeCode)
    : venues

  useTrackMapSessionDuration()
  useTrackMapSeenDuration()

  const { data: selectedVenueOffers } = useVenueOffers(
    bottomSheetOffersEnabled ? transformGeoLocatedVenueToVenueResponse(selectedVenue) : undefined
  )

  const hasOffers = !!selectedVenueOffers && selectedVenueOffers.hits?.length

  const snapPoints = useMemo(() => {
    const contentViewHeight = {
      min: hasOffers ? 160 : 130,
      max: hasOffers ? 160 + LENGTH_L : 130,
    }
    const bottomInset = from === 'venueMap' ? bottom : tabBarHeight
    const points = Object.entries(contentViewHeight).map(([_key, value]) => bottomInset + value)

    return Array.from(new Set(points))
  }, [from, bottom, hasOffers, tabBarHeight])

  const centerOnLocation = useCenterOnLocation({ currentRegion, mapViewRef, mapHeight: height })

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region)
    setShowSearchButton(true)
  }

  const handleSearchPress = () => {
    setInitialVenues([])
    setLastRegionSearched(currentRegion)
    setShowSearchButton(false)
  }

  const navigateToVenue = (venueId: number) => {
    onNavigateToVenuePress(venueId)
    navigate('Venue', { id: venueId })
  }

  const calculatePreviewHeight = useCallback(
    (bottomSheetSnapPoint = 0) =>
      Math.max(0, bottomSheetSnapPoint - (from === 'venueMap' ? 0 : tabBarHeight)),
    [from, tabBarHeight]
  )

  const handleMarkerPress = (event: MarkerPressEvent) => {
    // Prevents the onPress of the MapView from being triggered
    event.stopPropagation()
    const foundVenue = filteredVenues.find(
      (venue) => venue.venueId.toString() === event.nativeEvent.id
    )

    if (!foundVenue) {
      return
    }

    setShowSearchButton(false)
    analytics.logPinMapPressed({ venueType: foundVenue.venue_type, venueId: foundVenue.venueId })
    if (isPreviewEnabled) {
      setSelectedVenue(foundVenue)

      centerOnLocation(
        event.nativeEvent.coordinate.latitude,
        event.nativeEvent.coordinate.longitude,
        calculatePreviewHeight(snapPoints[bottomSheetIndex])
      )
    } else {
      navigateToVenue(foundVenue.venueId)
    }
  }

  const handlePressOutOfVenuePin = () => {
    if (selectedVenue) {
      removeSelectedVenue()
    }
  }

  const handleMapReady = () => setMapReady(true)

  const onNavigateToVenuePress = (venueId: number) => {
    analytics.logConsultVenue({ venueId, from: 'venueMap' })
  }

  const handleBottomSheetAnimation = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex === 0 && fromIndex < toIndex && selectedVenue) {
        centerOnLocation(
          selectedVenue?._geoloc.lat,
          selectedVenue?._geoloc.lng,
          calculatePreviewHeight(snapPoints[toIndex])
        )
      }
    },
    [centerOnLocation, calculatePreviewHeight, selectedVenue, snapPoints]
  )

  useEffect(() => {
    if (mapReady && venues.length > 1) {
      zoomOutIfMapEmpty({ mapViewRef, venues })
    }
  }, [venues, mapReady])

  useEffect(() => {
    if (!mapReady) {
      return
    }

    if (selectedVenue) {
      bottomSheetRef.current?.collapse()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [selectedVenue, mapReady])

  const PlaylistContainer = useMemo(() => {
    if (from === 'venueMap') {
      return undefined
    }
    return styled(View)({
      flex: 1,
      paddingBottom: tabBarHeight,
    })
  }, [tabBarHeight, from])

  return (
    <React.Fragment>
      <VenueMapBottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onClose={removeSelectedVenue}
        venue={selectedVenue}
        venueOffers={bottomSheetOffersEnabled ? selectedVenueOffers?.hits : undefined}
        PlaylistContainer={PlaylistContainer}
        onAnimate={handleBottomSheetAnimation}
        onChange={setBottomSheetIndex}
        playlistType={playlistType}
      />
      <StyledMapView
        ref={mapViewRef}
        showsUserLocation
        initialRegion={defaultRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={handleMapReady}
        moveOnMarkerPress={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        renderCluster={VenueMapCluster}
        onPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        onClusterPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        radius={50}
        animationEnabled={false}
        height={height}
        testID="venue-map-view">
        {filteredVenues.map((venue) => (
          <Marker
            key={venue.venueId}
            coordinate={{
              latitude: venue._geoloc.lat ?? 0,
              longitude: venue._geoloc.lng ?? 0,
            }}
            onPress={handleMarkerPress}
            image={{
              uri: getVenueTypeIconName(venue.venueId === selectedVenue?.venueId, venue.venue_type),
            }}
            identifier={venue.venueId.toString()}
            testID={`marker-${venue.venueId}`}
            zIndex={venue.venueId === selectedVenue?.venueId ? PIN_MAX_Z_INDEX : undefined}
          />
        ))}
      </StyledMapView>
      {hasSearchButton ? (
        <ButtonContainer>
          <ButtonPrimary wording="Rechercher dans cette zone" onPress={handleSearchPress} />
        </ButtonContainer>
      ) : null}
    </React.Fragment>
  )
}

const StyledMapView = styled(MapView)<{ height?: number }>(({ height }) => ({
  height: height ?? '100%',
  width: '100%',
}))

const ButtonContainer = styled.View({
  position: 'absolute',
  top: getSpacing(4),
  left: getSpacing(13.5),
  right: getSpacing(13.5),
  alignItems: 'center',
})
