import { Venue } from 'features/venue/types'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  initialVenues: Venue[]
}

const defaultState: State = { initialVenues: [] }

const useInitialVenuesStore = createStore({
  name: 'venue-map-store',
  defaultState,
  options: { persist: true },
})

export const useInitialVenues = () => useInitialVenuesStore((state) => state.initialVenues)

export const initialVenuesActions = createActions(useInitialVenuesStore, (set) => ({
  setInitialVenues: (initialVenues: Venue[]) => set({ initialVenues }),
}))
