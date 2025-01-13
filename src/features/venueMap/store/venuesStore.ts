import { Venue } from 'features/venue/types'
import { createStore } from 'libs/store/createStore'

type State = {
  venues: Venue[]
}

const defaultState: State = { venues: [] }

const venuesStore = createStore({
  name: 'venue-map-venues',
  defaultState,
  actions: (set) => ({
    setVenues: (venues: Venue[]) => set({ venues }),
  }),
})

export const venuesActions = venuesStore.actions
export const useVenues = () => venuesStore.useStore((state) => state.venues)
