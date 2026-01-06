import { difference } from 'lodash'

import { Activity } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State = {
  venuesFilters: Activity[]
}

const defaultState: State = {
  venuesFilters: [],
}

const venuesFilterStore = createStore({
  name: 'venue-filter',
  defaultState,
  actions: (set) => ({
    setVenuesFilters: (venuesFilters: Activity[]) => set((_) => ({ venuesFilters })),
    addVenuesFilters: (venueTypeCodeKeys: Activity[]) =>
      set((state: State) => ({
        venuesFilters: Array.from(new Set([...state.venuesFilters, ...venueTypeCodeKeys])),
      })),
    removeVenuesFilters: (venueTypeCodeKeys: Activity[]) =>
      set((state: State) => ({
        venuesFilters: difference(state.venuesFilters, venueTypeCodeKeys),
      })),
    reset: () => set((_) => ({ venuesFilters: [] })),
  }),
  selectors: {
    selectVenuesFilter: () => (state) => state.venuesFilters,
  },
})

export const venuesFilterActions = venuesFilterStore.actions

export const { useVenuesFilter } = venuesFilterStore.hooks
