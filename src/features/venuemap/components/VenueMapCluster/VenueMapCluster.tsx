import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { MapPinWithCounter } from 'features/venuemap/components/MapPinWithCounter/MapPinWithCounter'
import { Marker } from 'libs/maps/maps'

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
    <StyledMarker
      key={properties.cluster_id}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      points={points}
      onPress={onPress}
      testID="venue-map-cluster">
      <TouchableOpacity activeOpacity={0.5}>
        <MapPinWithCounter count={points} />
      </TouchableOpacity>
    </StyledMarker>
  )
}

const StyledMarker = styled(Marker)<{ points: number }>(({ points }) => ({
  zIndex: points + 1,
}))
