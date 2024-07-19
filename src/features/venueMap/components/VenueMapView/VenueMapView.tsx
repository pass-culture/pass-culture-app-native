import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueMapBottomSheet } from 'features/venueMap/components/VenueMapBottomSheet/VenueMapBottomSheet'
import { VenueMapCluster } from 'features/venueMap/components/VenueMapCluster/VenueMapCluster'
import { transformGeoLocatedVenueToVenueResponse } from 'features/venueMap/helpers/geoLocatedVenueToVenueResponse/geoLocatedVenueToVenueResponse'
import { getVenueTypeIconName } from 'features/venueMap/helpers/getVenueTypeIconName/getVenueTypeIconName'
import { zoomOutIfMapEmpty } from 'features/venueMap/helpers/zoomOutIfMapEmpty'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackSessionDuration'
import {
  useInitialVenues,
  useInitialVenuesActions,
} from 'features/venueMap/store/initialVenuesStore'
import {
  useSelectedVenue,
  useSelectedVenueActions,
} from 'features/venueMap/store/selectedVenueStore'
import { useVenueTypeCode } from 'features/venueMap/store/venueTypeCodeStore'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import MapView, { Map, Marker, MarkerPressEvent, Region } from 'libs/maps/maps'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, LENGTH_L } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  height: number
  from: 'venueMap' | 'searchResults'
}

const PREVIEW_HEIGHT_ESTIMATION = 114

const PIN_MAX_Z_INDEX = 10_000

export const VenueMapView: FunctionComponent<Props> = ({ height, from }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { tabBarHeight } = useCustomSafeInsets()
  const { bottom } = useSafeAreaInsets()
  const initialVenues = useInitialVenues()
  const { setInitialVenues } = useInitialVenuesActions()
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const mapViewRef = useRef<Map>(null)
  const previewHeight = useRef<number>(PREVIEW_HEIGHT_ESTIMATION)

  const defaultRegion = useGetDefaultRegion()
  const [currentRegion, setCurrentRegion] = useState<Region>(defaultRegion)
  const [lastRegionSearched, setLastRegionSearched] = useState<Region>(defaultRegion)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const hasSearchButton = from === 'venueMap' ? showSearchButton : false
  const [mapReady, setMapReady] = useState(false)

  const selectedVenue = useSelectedVenue()
  const venueTypeCode = useVenueTypeCode()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { setSelectedVenue, removeSelectedVenue } = useSelectedVenueActions()

  const venues = useGetVenuesInRegion(lastRegionSearched, selectedVenue, initialVenues)
  const filteredVenues = venueTypeCode
    ? venues.filter((venue) => venue.venue_type === venueTypeCode)
    : venues

  useTrackMapSessionDuration()
  useTrackMapSeenDuration()

  const { data: selectedVenueOffers } = useVenueOffers(
    transformGeoLocatedVenueToVenueResponse(selectedVenue)
  )

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
    setInitialVenues([])
    setLastRegionSearched(currentRegion)
    setShowSearchButton(false)
  }

  const navigateToVenue = (venueId: number) => {
    onNavigateToVenuePress(venueId)
    navigate('Venue', { id: venueId })
  }

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
        event.nativeEvent.coordinate.longitude
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

  useEffect(() => {
    if (mapReady && venues.length > 1) {
      zoomOutIfMapEmpty({ mapViewRef, venues })
    }
  }, [venues, mapReady])

  useEffect(() => {
    if (selectedVenue) {
      bottomSheetRef.current?.collapse()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [selectedVenue])

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
        venueOffers={selectedVenueOffers?.hits}
        PlaylistContainer={PlaylistContainer}
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
