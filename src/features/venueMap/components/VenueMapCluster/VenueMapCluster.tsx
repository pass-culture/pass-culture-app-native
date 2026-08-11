import React from 'react'
import styled from 'styled-components/native'
// eslint-disable-next-line no-restricted-imports

import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { MARKER_SIZE } from 'features/venueMap/constant'
import { getClusterImage } from 'features/venueMap/helpers/venueMapCluster/getClusterImage'
import { Marker } from 'libs/maps/maps'
/**
 * These properties are not originally defined by us, but are inferred from the usage
 * of react-native-map-clustering that tends to type "cluster" as 'any'.
 * To address this, we have created this specific typing to ensure clarity and accuracy.
 */

export type Coordinates = [latitude: number, longitude: number]

export type Properties = {
  cluster: boolean
  cluster_id: number
  point_count: number
  point_count_abbreviated: number
}

export type VenueMapClusterProps = {
  geometry: {
    coordinates: Coordinates
    type: string
  }
  properties: Properties
  color?: ClusterImageColorName
  onPress: VoidFunction
}

export const VenueMapCluster = ({ geometry, properties, onPress, color }: VenueMapClusterProps) => {
  const imageName = getClusterImage(properties.point_count, color)

  return (
    <Marker
      key={properties.cluster_id}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: properties.point_count + 1 }}
      onPress={onPress}
      testID="venue-map-cluster">
      {imageName ? <ClusterImage source={{ uri: imageName }} /> : null}
    </Marker>
  )
}

const ClusterImage = styled.Image({
  width: MARKER_SIZE.width,
  height: MARKER_SIZE.height,
  resizeMode: 'contain',
})
