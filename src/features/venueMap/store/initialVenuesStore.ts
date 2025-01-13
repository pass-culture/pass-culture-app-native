import { Venue } from 'features/venue/types'
import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type State = {
  initialVenues: Venue[]
}

const defaultState: State = { initialVenues: [] }

const useInitialVenuesStore = createConfiguredStore({
  name: 'venue-map-store',
  defaultState,
  options: { persist: true },
})

export const useInitialVenues = () => useInitialVenuesStore((state) => state.initialVenues)

export const initialVenuesActions = createActions(useInitialVenuesStore, (set) => ({
  setInitialVenues: (initialVenues: Venue[]) => set({ initialVenues }),
}))
