import React from 'react'
import { TouchableOpacity } from 'react-native'

import { MapPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'
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

type VenueMapClusterProps = {
  geometry: {
    coordinates: Coordinates
    type: string
  }
  properties: Properties
  onPress: VoidFunction
}

export const VenueMapCluster = ({ geometry, properties, onPress }: VenueMapClusterProps) => {
  const points = properties.point_count

  return (
    <Marker
      key={properties.cluster_id}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      style={{ zIndex: points + 1 }}
      onPress={onPress}
      testID="venue-map-cluster">
      <TouchableOpacity activeOpacity={0.5}>
        <MapPinWithCounter count={points} />
      </TouchableOpacity>
    </Marker>
  )
}
