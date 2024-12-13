import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { PlaylistType } from 'features/offer/enums'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useVenuesMapData } from 'features/venueMap/hook/useVenuesMapData'
import { VenueMapBase } from 'features/venueMap/pages/VenueMap/VenueMapBase'
import { useInitialVenues } from 'features/venueMap/store/initialVenuesStore'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const VenueMap: FunctionComponent = () => {
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
