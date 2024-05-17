import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { createStore } from 'libs/store/createStore'

type State = {
  selectedVenue: GeolocatedVenue | null
}
type Actions = {
  setSelectedVenue: (payload: GeolocatedVenue | null) => void
  removeSelectedVenue: () => void
}

const useSelectedVenueStore = createStore<State, Actions>(
  'venue-map-selected-venue',
  { selectedVenue: null },
  (set) => ({
    setSelectedVenue: (payload) => set({ selectedVenue: payload }),
    removeSelectedVenue: () => set({ selectedVenue: null }),
  })
)

export const useSelectedVenue = () => useSelectedVenueStore((state) => state.selectedVenue)
export const useSelectedVenueActions = () => useSelectedVenueStore((state) => state.actions)
