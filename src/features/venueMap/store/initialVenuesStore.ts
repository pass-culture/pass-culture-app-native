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
  options: { persist: true },
})

const useInitialVenuesStore = initialVenuesStore.useStore
export const initialVenuesActions = initialVenuesStore.actions

export const useInitialVenues = () => useInitialVenuesStore((state) => state.initialVenues)
