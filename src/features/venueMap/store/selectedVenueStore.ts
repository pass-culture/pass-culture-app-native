import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'

type State = {
  selectedVenue: GeolocatedVenue | null
}
type Actions = {
  setSelectedVenue: (payload: GeolocatedVenue | null) => void
  removeSelectedVenue: () => void
}

export type Store = State & { actions: Actions }

const useSelectedVenueStore = create<Store>()(
  devtools(
    (set) => ({
      selectedVenue: null,
      actions: {
        setSelectedVenue: (payload) => set({ selectedVenue: payload }),
        removeSelectedVenue: () => set({ selectedVenue: null }),
      },
    }),
    { enabled: process.env.NODE_ENV === 'development' }
  )
)

export const useSelectedVenue = () => useSelectedVenueStore((state) => state.selectedVenue)
export const useSelectedVenueActions = () => useSelectedVenueStore((state) => state.actions)
