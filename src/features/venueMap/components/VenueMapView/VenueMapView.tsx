import React, {
  Fragment,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Platform } from 'react-native'
import { MapClusteringProps } from 'react-native-map-clustering'
import styled from 'styled-components/native'
import Supercluster from 'supercluster'

import { Activity } from 'api/gen'
import {
  VenueMapCluster,
  VenueMapClusterProps,
} from 'features/venueMap/components/VenueMapCluster/VenueMapCluster'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { MARKER_LABEL_VISIBILITY_LIMIT } from 'features/venueMap/constant'
import { getClusterColorByDominantActivity } from 'features/venueMap/helpers/venueMapCluster/getClusterColorByDominantActivity'
import { zoomOutIfMapEmpty } from 'features/venueMap/helpers/zoomOutIfMapEmpty'
import MapView, { Map, MapViewProps } from 'libs/maps/maps'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { Marker } from './Marker/Marker'

interface VenueMapViewProps
  extends Omit<
    MapClusteringProps & MapViewProps,
    | 'rotateEnabled'
    | 'pitchEnabled'
    | 'moveOnMarkerPress'
    | 'renderCluster'
    | 'radius'
    | 'animationEnabled'
    | 'showsUserLocation'
  > {
  venues: GeolocatedVenue[]
  selectedVenueId?: number
  showLabel?: boolean
  onSearch?: () => void
}

const CUSTOM_MAP_STYLES = [
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

export const VenueMapView = forwardRef<Map, VenueMapViewProps>(function VenueMapView(
  {
    venues,
    selectedVenueId,
    initialRegion,
    onMapReady,
    onMarkerPress,
    showLabel,
    onClusterPress,
    onRegionChangeComplete,
    onPress,
    onLayout,
    onSearch,
    ...mapProps
  },
  ref
) {
  const [labelVisible, setLabelVisible] = useState(false)
  const superClusterRef = useRef<Supercluster>(null)
  const mapRef = useRef<Map>(null)

  const ColoredCluster = useCallback(
    (clusterProps: VenueMapClusterProps) => {
      const clusterActivities =
        superClusterRef.current
          ?.getLeaves(clusterProps.properties.cluster_id, Infinity)
          .map(
            (leaf) =>
              venues.find((venue) => venue.venueId.toString() === leaf.properties.identifier)
                ?.activity
          )
          .filter((activity): activity is Activity => !!activity) ?? []
      return (
        <VenueMapCluster
          key={clusterProps.properties.cluster_id}
          {...clusterProps}
          color={getClusterColorByDominantActivity(clusterActivities)}
        />
      )
    },
    [venues]
  )

  useImperativeHandle(ref, () => mapRef.current ?? ({} as Map))

  const handleMapReady = () => {
    if (venues.length > 0) {
      zoomOutIfMapEmpty({ mapViewRef: mapRef, venues })
    }
    onMapReady?.()
  }

  const checkLabelVisibility = () => {
    mapRef.current?.getCamera().then((camera) => {
      setLabelVisible(
        Platform.OS === 'ios'
          ? Number(camera.altitude) <= MARKER_LABEL_VISIBILITY_LIMIT.altitude
          : Number(camera.zoom) >= MARKER_LABEL_VISIBILITY_LIMIT.zoom
      )
    })
  }

  return (
    <Fragment>
      <StyledMapView
        ref={mapRef}
        showsUserLocation
        initialRegion={initialRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onLayout={onLayout}
        onMapReady={handleMapReady}
        moveOnMarkerPress={false}
        onRegionChange={checkLabelVisibility}
        onRegionChangeComplete={onRegionChangeComplete}
        superClusterRef={superClusterRef}
        renderCluster={ColoredCluster}
        onPress={onPress}
        onClusterPress={onClusterPress}
        radius={50}
        animationEnabled={false}
        testID="venue-map-view"
        customMapStyle={CUSTOM_MAP_STYLES}
        {...mapProps}>
        {venues.map((venue) => (
          <Marker
            key={venue.venueId}
            venue={venue}
            showLabel={!!showLabel && labelVisible}
            identifier={venue.venueId.toString()}
            isSelected={venue.venueId === selectedVenueId}
            coordinate={{
              latitude: venue._geoloc.lat ?? 0,
              longitude: venue._geoloc.lng ?? 0,
            }}
            onPress={onMarkerPress}
          />
        ))}
      </StyledMapView>
      {onSearch ? (
        <ButtonContainer>
          <ButtonPrimary wording="Rechercher dans cette zone" onPress={onSearch} />
        </ButtonContainer>
      ) : null}
    </Fragment>
  )
})

const ButtonContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  alignSelf: 'center',
  top: theme.designSystem.size.spacing.l,
}))

const StyledMapView = styled(MapView)<{ height?: number }>({
  flex: 1,
  width: '100%',
})
