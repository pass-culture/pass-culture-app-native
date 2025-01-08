import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  selectedVenue: GeolocatedVenue | null
}

const defaultState: State = { selectedVenue: null }

const useSelectedVenueStore = createStore({ name: 'venue-map-selected-venue', defaultState })

export const useSelectedVenue = () => useSelectedVenueStore((state) => state.selectedVenue)

export const selectedVenueActions = createActions(useSelectedVenueStore, (set) => ({
  setSelectedVenue: (selectedVenue: GeolocatedVenue) => set({ selectedVenue }),
  removeSelectedVenue: () => set(defaultState),
}))
