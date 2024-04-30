import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueTypeCode } from 'libs/parsers/venueType'

type State = {
  venueTypeCode: VenueTypeCode | null
  venues: Venue[]
  selectedVenue: GeolocatedVenue | null
}
type Actions = {
  setVenueTypeCode: (payload: VenueTypeCode | null) => void
  setVenues: (payload: Venue[]) => void
  setSelectedVenue: (payload: GeolocatedVenue | null) => void
  removeSelectedVenue: () => void
}

export type Store = State & { actions: Actions }

const useVenueMapStore = create<Store>()(
  devtools(
    (set) => ({
      venueTypeCode: null,
      venues: [],
      selectedVenue: null,
      actions: {
        setVenueTypeCode: (payload) => set({ venueTypeCode: payload }),
        setVenues: (payload) => set({ venues: payload }),
        setSelectedVenue: (payload) => set({ selectedVenue: payload }),
        removeSelectedVenue: () => set({ selectedVenue: null }),
      },
    }),
    { enabled: process.env.NODE_ENV === 'development' }
  )
)

export const useVenueMapTypeCode = () => useVenueMapStore((state) => state.venueTypeCode)
export const useVenueMapVenues = () => useVenueMapStore((state) => state.venues)
export const useVenueMapSelectedVenue = () => useVenueMapStore((state) => state.selectedVenue)
export const useVenueMapActions = () => useVenueMapStore((state) => state.actions)
