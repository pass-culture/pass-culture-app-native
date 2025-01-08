import { useState } from 'react'

import { Venue } from 'features/venue/types'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { selectedVenueActions, useSelectedVenue } from 'features/venueMap/store/selectedVenueStore'
import { useVenueTypeCode } from 'features/venueMap/store/venueTypeCodeStore'

export const useVenuesMapData = (initialVenues: Venue[]) => {
  const selectedVenue = useSelectedVenue()
  const venueTypeCode = useVenueTypeCode()
  const { setSelectedVenue, removeSelectedVenue } = selectedVenueActions
  const defaultRegion = useGetDefaultRegion()
  const [currentRegion, setCurrentRegion] = useState(defaultRegion)
  const [lastRegionSearched, setLastRegionSearched] = useState(defaultRegion)

  const venuesMap = useGetVenuesInRegion(lastRegionSearched, selectedVenue, initialVenues)

  return {
    selectedVenue,
    venueTypeCode,
    setSelectedVenue,
    removeSelectedVenue,
    currentRegion,
    setCurrentRegion,
    setLastRegionSearched,
    venuesMap,
  }
}
