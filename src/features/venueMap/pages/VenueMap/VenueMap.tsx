import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { FILTER_BANNER_HEIGHT } from 'features/venueMap/components/VenueMapView/constant'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useVenuesMapData } from 'features/venueMap/hook/useVenuesMapData'
import { VenueMapBase } from 'features/venueMap/pages/VenueMap/VenueMapBase'
import { useInitialVenues } from 'features/venueMap/store/initialVenuesStore'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const headerHeight = useGetHeaderHeight()
  const { height } = useWindowDimensions()
  const venueMapHeight = height - (headerHeight + FILTER_BANNER_HEIGHT)

  const initialVenues = useInitialVenues()
  const {
    selectedVenue,
    venueTypeCode,
    setSelectedVenue,
    removeSelectedVenue,
    currentRegion,
    setCurrentRegion,
    setLastRegionSearched,
    venuesMap,
  } = useVenuesMapData(initialVenues)

  return (
    <VenueMapBase>
      <MapContainer>
        <VenueMapView
          height={venueMapHeight}
          from="venueMap"
          venues={venuesMap}
          selectedVenue={selectedVenue}
          venueTypeCode={venueTypeCode}
          setSelectedVenue={setSelectedVenue}
          removeSelectedVenue={removeSelectedVenue}
          currentRegion={currentRegion}
          setCurrentRegion={setCurrentRegion}
          setLastRegionSearched={setLastRegionSearched}
        />
      </MapContainer>
    </VenueMapBase>
  )
}

const MapContainer = styled.View({
  flex: 1,
})
