import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { PlaylistType } from 'features/offer/enums'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { FILTER_BANNER_HEIGHT } from 'features/venueMap/constant'
import { useVenuesMapData } from 'features/venueMap/hook/useVenuesMapData'
import { VenueMapBase } from 'features/venueMap/pages/VenueMap/VenueMapBase'
import { useInitialVenues } from 'features/venueMap/store/initialVenuesStore'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const headerHeight = useGetHeaderHeight()
  const { height } = useWindowDimensions()
  const venueMapHeight = height - (headerHeight + FILTER_BANNER_HEIGHT)
  const venueMapHiddenPOI = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP_HIDDEN_POI)

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
          playlistType={PlaylistType.TOP_OFFERS}
          hidePointsOfInterest={venueMapHiddenPOI}
        />
      </MapContainer>
    </VenueMapBase>
  )
}

const MapContainer = styled.View({
  flex: 1,
})
