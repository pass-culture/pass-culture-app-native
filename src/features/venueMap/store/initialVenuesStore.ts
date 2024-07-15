import { Venue } from 'features/venue/types'
import { createStore } from 'libs/store/createStore'

type State = {
  initialVenues: Venue[]
}

const defaultState: State = { initialVenues: [] }

const setActions = (set: (payload: State) => void) => ({
  setInitialVenues: (payload: Venue[]) => set({ initialVenues: payload }),
})

const useInitialVenuesStore = createStore<State, ReturnType<typeof setActions>>(
  'venue-map-store',
  defaultState,
  setActions,
  { persist: true }
)

export const useInitialVenues = () => useInitialVenuesStore((state) => state.initialVenues)
export const useInitialVenuesActions = () => useInitialVenuesStore((state) => state.actions)
