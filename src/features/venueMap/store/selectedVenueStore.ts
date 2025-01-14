import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { createStore } from 'libs/store/createStore'

type State = {
  selectedVenue: GeolocatedVenue | null
}

const defaultState: State = { selectedVenue: null }

const selectedVenueStore = createStore({
  name: 'venue-map-selected-venue',
  defaultState,
  actions: (set) => ({
    setSelectedVenue: (selectedVenue: GeolocatedVenue) => set({ selectedVenue }),
    removeSelectedVenue: () => set(defaultState),
  }),
})

export const selectedVenueActions = selectedVenueStore.actions

export const useSelectedVenue = () => selectedVenueStore.useStore((state) => state.selectedVenue)
