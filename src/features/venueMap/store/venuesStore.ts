import { Venue } from 'features/venue/types'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  venues: Venue[]
}

const defaultState: State = { venues: [] }

const useVenuesStore = createStore({ name: 'venue-map-venues', defaultState })

export const useVenues = () => useVenuesStore((state) => state.venues)

export const venuesActions = createActions(useVenuesStore, (set) => ({
  setVenues: (venues: Venue[]) => set({ venues }),
}))
