import { Venue } from 'features/venue/types'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  initialVenues: Venue[]
}

const defaultState: State = { initialVenues: [] }

const useInitialVenuesStore = createStore('venue-map-store', defaultState, { persist: true })

export const useInitialVenues = () => useInitialVenuesStore((state) => state.initialVenues)

export const initialVenuesActions = createActions(useInitialVenuesStore, (set) => ({
  setInitialVenues: (payload: Venue[]) => set({ initialVenues: payload }),
}))
