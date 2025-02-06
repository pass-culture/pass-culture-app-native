import { Venue } from 'features/venue/types'
import { createStore } from 'libs/store/createStore'

type State = {
  initialVenues: Venue[]
}

const defaultState: State = { initialVenues: [] }

const initialVenuesStore = createStore({
  name: 'venue-map-store',
  defaultState,
  actions: (set) => ({
    setInitialVenues: (initialVenues: Venue[]) => set({ initialVenues }),
  }),
  selectors: {
    selectInitialVenues: () => (state) => state.initialVenues,
  },
  options: { persist: true },
})

export const initialVenuesActions = initialVenuesStore.actions

export const { useInitialVenues } = initialVenuesStore.hooks
