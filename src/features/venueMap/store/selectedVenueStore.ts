import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { createStore } from 'libs/store/createStore'

type State = {
  selectedVenue: GeolocatedVenue | null
}

const defaultState: State = { selectedVenue: null }

const setActions = (set: (payload: State) => void) => ({
  setSelectedVenue: (payload: GeolocatedVenue) => set({ selectedVenue: payload }),
  removeSelectedVenue: () => set(defaultState),
})

const useSelectedVenueStore = createStore<State, ReturnType<typeof setActions>>(
  'venue-map-selected-venue',
  defaultState,
  setActions
)

export const useSelectedVenue = () => useSelectedVenueStore((state) => state.selectedVenue)
export const useSelectedVenueActions = () => useSelectedVenueStore((state) => state.actions)
