import { difference } from 'lodash'

import { VenueTypeCodeKey } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State = {
  venuesFilters: VenueTypeCodeKey[]
}

const defaultState: State = {
  venuesFilters: [],
}

const venuesFilterStore = createStore({
  name: 'venue-filter',
  defaultState,
  actions: (set) => ({
    setVenuesFilters: (venuesFilters: VenueTypeCodeKey[]) => set((_) => ({ venuesFilters })),
    addVenuesFilters: (venueTypeCodeKeys: VenueTypeCodeKey[]) =>
      set((state: State) => ({
        venuesFilters: Array.from(new Set([...state.venuesFilters, ...venueTypeCodeKeys])),
      })),
    removeVenuesFilters: (venueTypeCodeKeys: VenueTypeCodeKey[]) =>
      set((state: State) => ({
        venuesFilters: difference(state.venuesFilters, venueTypeCodeKeys),
      })),
    reset: () => set((_) => ({ venuesFilters: [] })),
  }),
})

export const venuesFilterActions = venuesFilterStore.actions

export const useVenuesFilter = () => venuesFilterStore.useStore((state) => state.venuesFilters)
