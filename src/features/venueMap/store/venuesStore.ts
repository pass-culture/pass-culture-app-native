import { Venue } from 'features/venue/types'
import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type State = {
  venues: Venue[]
}

const defaultState: State = { venues: [] }

const useVenuesStore = createConfiguredStore({ name: 'venue-map-venues', defaultState })

export const useVenues = () => useVenuesStore((state) => state.venues)

export const venuesActions = createActions(useVenuesStore, (set) => ({
  setVenues: (venues: Venue[]) => set({ venues }),
}))
