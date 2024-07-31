import { useState } from 'react'

import { Venue } from 'features/venue/types'
import { useGetDefaultRegion } from 'features/venueMap/hook/useGetDefaultRegion'
import { useGetVenuesInRegion } from 'features/venueMap/hook/useGetVenuesInRegion'
import { useInitialVenues } from 'features/venueMap/store/initialVenuesStore'
import {
  useSelectedVenue,
  useSelectedVenueActions,
} from 'features/venueMap/store/selectedVenueStore'
import { useVenueTypeCode } from 'features/venueMap/store/venueTypeCodeStore'

export type TransformVenues = (initialVenues: Venue[]) => Venue[]

export const useVenuesMapData = (transformVenues?: TransformVenues) => {
  const initialVenues = useInitialVenues()
  const selectedVenue = useSelectedVenue()
  const venueTypeCode = useVenueTypeCode()
  const { setSelectedVenue, removeSelectedVenue } = useSelectedVenueActions()
  const defaultRegion = useGetDefaultRegion()
  const [currentRegion, setCurrentRegion] = useState(defaultRegion)
  const [lastRegionSearched, setLastRegionSearched] = useState(defaultRegion)

  const venuesData = transformVenues ? transformVenues(initialVenues) : initialVenues
  const venuesMap = useGetVenuesInRegion(lastRegionSearched, selectedVenue, venuesData)

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
