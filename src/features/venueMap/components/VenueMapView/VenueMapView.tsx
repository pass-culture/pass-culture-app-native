import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import Supercluster from 'supercluster'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueMapBottomSheet } from 'features/venueMap/components/VenueMapBottomSheet/VenueMapBottomSheet'
import {
  VenueMapCluster,
  VenueMapClusterProps,
} from 'features/venueMap/components/VenueMapCluster/VenueMapCluster'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { transformGeoLocatedVenueToVenueResponse } from 'features/venueMap/helpers/geoLocatedVenueToVenueResponse/geoLocatedVenueToVenueResponse'
import { getClusterColorByDominantVenueType } from 'features/venueMap/helpers/venueMapCluster/getClusterColorByDominantVenueType'
import { zoomOutIfMapEmpty } from 'features/venueMap/helpers/zoomOutIfMapEmpty'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useTrackMapSeenDuration } from 'features/venueMap/hook/useTrackMapSeenDuration'
import { useTrackMapSessionDuration } from 'features/venueMap/hook/useTrackSessionDuration'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import MapView, { MapViewProps, Map, MarkerPressEvent, Region } from 'libs/maps/maps'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LENGTH_L, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { MARKER_LABEL_VISIBILITY_LIMIT } from './constant'
import { Marker } from './Marker/Marker'

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
  hidePointsOfInterest?: boolean
  playlistType: PlaylistType
}

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
  hidePointsOfInterest = false,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { tabBarHeight } = useCustomSafeInsets()
  const { bottom } = useSafeAreaInsets()

  const { setInitialVenues } = useInitialVenuesActions()
  const isPreviewEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const shouldDisplayPinV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2)
  const bottomSheetOffersEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET
  )
  const mapViewRef = useRef<Map>(null)

  const defaultRegion = useGetDefaultRegion()

  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const hasSearchButton = from === 'venueMap' ? showSearchButton : false
  const [mapReady, setMapReady] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1)

  const superClusterRef = useRef<Supercluster>()

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

  const checkLabelVisibility = () => {
    if (!mapViewRef.current) {
      return
    }

    mapViewRef.current.getCamera().then((camera) => {
      setLabelVisible(
        Platform.OS === 'ios'
          ? Number(camera.altitude) <= MARKER_LABEL_VISIBILITY_LIMIT.altitude
          : Number(camera.zoom) >= MARKER_LABEL_VISIBILITY_LIMIT.zoom
      )
    })
  }

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

  const handleMapReady = () => {
    setMapReady(true)
    checkLabelVisibility()
  }

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

  const pointsOfInterestProps = useMemo(
    () =>
      ({
        showsPointsOfInterest: !hidePointsOfInterest,
        customMapStyle: hidePointsOfInterest
          ? [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                  {
                    visibility: 'off',
                  },
                ],
              },
            ]
          : undefined,
      }) satisfies Pick<MapViewProps, 'showsPointsOfInterest' | 'customMapStyle'>,
    [hidePointsOfInterest]
  )

  const ColoredCluster = useCallback(
    (clusterProps: VenueMapClusterProps) => {
      const clusterVenueTypes =
        superClusterRef.current
          ?.getLeaves(clusterProps.properties.cluster_id, Infinity)
          .map(
            (leaf) =>
              filteredVenues.find(
                (venue) => venue.venueId.toString() === leaf.properties.identifier
              )?.venue_type
          )
          .filter((venueType): venueType is VenueTypeCode => !!venueType) ?? []
      return (
        <VenueMapCluster
          {...clusterProps}
          color={getClusterColorByDominantVenueType(clusterVenueTypes)}
        />
      )
    },
    [filteredVenues]
  )

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
        onRegionChange={checkLabelVisibility}
        onRegionChangeComplete={handleRegionChangeComplete}
        superClusterRef={superClusterRef}
        renderCluster={ColoredCluster}
        onPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        onClusterPress={isPreviewEnabled ? handlePressOutOfVenuePin : undefined}
        radius={50}
        animationEnabled={false}
        height={height}
        testID="venue-map-view"
        {...pointsOfInterestProps}>
        {filteredVenues.map((venue) => (
          <Marker
            key={venue.venueId}
            venue={venue}
            showLabel={shouldDisplayPinV2 && labelVisible}
            identifier={venue.venueId.toString()}
            isSelected={venue.venueId === selectedVenue?.venueId}
            coordinate={{
              latitude: venue._geoloc.lat ?? 0,
              longitude: venue._geoloc.lng ?? 0,
            }}
            onPress={handleMarkerPress}
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
