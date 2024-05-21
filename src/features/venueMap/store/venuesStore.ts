import { Venue } from 'features/venue/types'
import { createStore } from 'libs/store/createStore'

type State = {
  venues: Venue[]
}

const defaultState: State = { venues: [] }

const setActions = (set: (payload: State) => void) => ({
  setVenues: (payload: Venue[]) => set({ venues: payload }),
})

const useVenuesStore = createStore<State, ReturnType<typeof setActions>>(
  'venue-map-venues',
  defaultState,
  setActions
)

export const useVenues = () => useVenuesStore((state) => state.venues)
export const useVenuesActions = () => useVenuesStore((state) => state.actions)
