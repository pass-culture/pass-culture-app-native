import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { FILTER_BANNER_HEIGHT } from 'features/venueMap/components/VenueMapView/constant'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { VenueMapBase } from 'features/venueMap/pages/VenueMap/VenueMapBase'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const headerHeight = useGetHeaderHeight()
  const { height } = useWindowDimensions()
  const venueMapHeight = height - (headerHeight + FILTER_BANNER_HEIGHT)
  return (
    <VenueMapBase>
      <MapContainer>
        <VenueMapView height={venueMapHeight} from="venueMap" />
      </MapContainer>
    </VenueMapBase>
  )
}

const MapContainer = styled.View({
  flex: 1,
})
