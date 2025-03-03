import BottomSheet from '@gorhom/bottom-sheet'
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { Referrals, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'
import { VenueMapBottomSheet } from 'features/venueMap/components/VenueMapBottomSheet/VenueMapBottomSheet'
import { transformGeoLocatedVenueToVenueResponse } from 'features/venueMap/helpers/geoLocatedVenueToVenueResponse/geoLocatedVenueToVenueResponse'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackMapSessionDuration'
import { useVenueMapFilters } from 'features/venueMap/hook/useVenueMapFilters'
import {
  removeSelectedVenue,
  setRegion,
  setSelectedVenue,
  setVenues,
  useVenueMapStore,
} from 'features/venueMap/store/venueMapStore'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { Map, MarkerPressEvent, Region } from 'libs/maps/maps'
import { LENGTH_L } from 'ui/theme'

import { VenueMapView } from './VenueMapView'

export const VenueMapViewContainer: FunctionComponent = () => {
  const offersPlaylistType = useVenueMapStore((state) => state.offersPlaylistType)
  const initialRegion = useVenueMapStore((state) => state.initialRegion)
  const venues = useVenueMapStore((state) => state.venues)
  const currentRegion = useVenueMapStore((state) => state.region)
  const selectedVenue = useVenueMapStore((state) => state.selectedVenue)
  const venueTypeCode = useVenueMapStore((state) => state.venueTypeCode)

  const { navigate } = useNavigation<UseNavigationType>()
  const { bottom } = useSafeAreaInsets()
  const { name: routeName } = useRoute()

  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0

  const currentRegionVenues = useGetVenuesInRegion(currentRegion)

  const isInVenueMapScreen = routeName.toLowerCase() === 'venuemap'

  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const shouldDisplayPinV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2)
  const hidePointsOfInterest = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_HIDDEN_POI)
  const shouldNavigateToVenueOnFling = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE
  )
  const bottomSheetOffersEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET
  )
  const filterCategoriesActive =
    useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2) && isInVenueMapScreen

  const mapViewRef = useRef<Map>(null)
  const [mapLayout, setMapLayout] = useState<LayoutRectangle>()

  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const isSearchEnabled = isInVenueMapScreen ? showSearchButton : false
  const [mapReady, setMapReady] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  useTrackMapSessionDuration()
  useTrackMapSeenDuration()

  const venue = bottomSheetOffersEnabled
    ? transformGeoLocatedVenueToVenueResponse(selectedVenue)
    : undefined
  const { userLocation, selectedLocationMode } = useLocation()
  const transformHits = useTransformOfferHits()
  const venueSearchParams = useVenueSearchParameters(venue)
  const { searchState } = useSearch()
  const isUserUnderage = useIsUserUnderage()
  const { data: selectedVenueOffers } = useVenueOffers({
    userLocation,
    selectedLocationMode,
    isUserUnderage,
    venueSearchParams,
    searchState,
    transformHits,
    venue,
  })

  const hasOffers = !!selectedVenueOffers && selectedVenueOffers.hits?.length
  const contentViewHeight = useMemo(
    () => ({
      min: hasOffers ? 160 : 130,
      max: hasOffers ? 160 + LENGTH_L : 130,
    }),
    [hasOffers]
  )

  const snapPoints = useMemo(() => {
    const bottomInset = tabBarHeight + bottom
    const points = Object.entries(contentViewHeight).map(([_key, value]) => bottomInset + value)
    return Array.from(new Set(points))
  }, [bottom, tabBarHeight, contentViewHeight])

  const centerOnLocation = useCenterOnLocation({
    currentRegion,
    mapViewRef,
    mapHeight: mapLayout?.height ? mapLayout.height - tabBarHeight - bottom : 0,
  })

  const handleMapLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (!mapLayout) {
      setMapLayout(nativeEvent.layout)
    }
  }

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region)
    setShowSearchButton(true)
  }

  const handleSearchPress = () => {
    if (currentRegionVenues) {
      setVenues(currentRegionVenues)
    }
    setShowSearchButton(false)
  }

  const navigateToVenue = (venueId: number) => {
    onNavigateToVenuePress(venueId)
    navigate('Venue', { id: venueId })
  }

  const calculatePreviewHeight = useCallback(
    (bottomSheetSnapPoint = 0) => Math.max(0, bottomSheetSnapPoint - (tabBarHeight + bottom)),
    [tabBarHeight, bottom]
  )

  const handleMarkerPress = (event: MarkerPressEvent) => {
    // Prevents the onPress of the MapView from being triggered
    event.stopPropagation()
    const foundVenue = venues.find((venue) => venue.venueId.toString() === event.nativeEvent.id)

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

  const handleMapReady = () => {
    setMapReady(true)
  }

  const onNavigateToVenuePress = (venueId: number) => {
    analytics.logConsultVenue({ venueId, from: routeName as Referrals })
  }

  const handleBottomSheetAnimation = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex === 0 && fromIndex < toIndex && selectedVenue) {
        centerOnLocation(
          selectedVenue?._geoloc.lat,
          selectedVenue?._geoloc.lng,
          calculatePreviewHeight(snapPoints[toIndex])
        )
      } else if (toIndex === -1 && selectedVenue) {
        removeSelectedVenue()
      }
    },
    [centerOnLocation, calculatePreviewHeight, selectedVenue, snapPoints]
  )

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

  const handleFlingUp = () => {
    if (
      shouldNavigateToVenueOnFling &&
      selectedVenue &&
      bottomSheetIndex === snapPoints.length - 1
    ) {
      navigateToVenue(selectedVenue.venueId)
    }
  }

  // Category filters
  const { activeFilters } = useVenueMapFilters()

  const filteredVenues = useMemo(() => {
    if (filterCategoriesActive) {
      if (activeFilters.length === 0) return venues
      return venues?.filter((venue) => venue.venue_type && activeFilters.includes(venue.venue_type))
    } else {
      return venueTypeCode ? venues?.filter((venue) => venue.venue_type === venueTypeCode) : venues
    }
  }, [venues, activeFilters, filterCategoriesActive, venueTypeCode])

  return initialRegion ? (
    <Container>
      <VenueMapBottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onClose={removeSelectedVenue}
        venue={selectedVenue}
        onFlingUp={handleFlingUp}
        venueOffers={bottomSheetOffersEnabled ? selectedVenueOffers?.hits : undefined}
        onAnimate={handleBottomSheetAnimation}
        onChange={setBottomSheetIndex}
        offersPlaylistType={offersPlaylistType}
      />
      <VenueMapView
        ref={mapViewRef}
        showLabel={shouldDisplayPinV2}
        initialRegion={initialRegion}
        selectedVenueId={selectedVenue?.venueId}
        onLayout={handleMapLayout}
        onMapReady={handleMapReady}
        onRegionChangeComplete={handleRegionChangeComplete}
        onSearch={isSearchEnabled ? handleSearchPress : undefined}
        onPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        onClusterPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        hidePointsOfInterest={hidePointsOfInterest}
        onMarkerPress={handleMarkerPress}
        venues={filteredVenues}
      />
    </Container>
  ) : null
}

const Container = styled.View({
  flex: 1,
})
