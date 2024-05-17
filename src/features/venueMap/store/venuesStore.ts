import { Venue } from 'features/venue/types'
import { createStore } from 'libs/store/createStore'

type State = {
  venues: Venue[]
}
type Actions = {
  setVenues: (payload: Venue[]) => void
}

const useVenuesStore = createStore<State, Actions>('venue-map-venues', { venues: [] }, (set) => ({
  setVenues: (payload) => set({ venues: payload }),
}))

export const useVenues = () => useVenuesStore((state) => state.venues)
export const useVenuesActions = () => useVenuesStore((state) => state.actions)
