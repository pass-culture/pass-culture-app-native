import { difference } from 'lodash'

import { VenueTypeCodeKey } from 'api/gen'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  venuesFilters: VenueTypeCodeKey[]
}

const defaultState: State = {
  venuesFilters: [],
}

const useVenuesFilterStore = createStore({ name: 'venue-filter', defaultState })

export const useVenuesFilter = () => useVenuesFilterStore((state) => state.venuesFilters)

export const venuesFilterActions = createActions(useVenuesFilterStore, (set) => ({
  setVenuesFilters: (venuesFilters: VenueTypeCodeKey[]) => set((_) => ({ venuesFilters })),
  addVenuesFilters: (VenueTypeCodeKeys: VenueTypeCodeKey[]) =>
    set((state: State) => ({
      venuesFilters: Array.from(new Set([...state.venuesFilters, ...VenueTypeCodeKeys])),
    })),
  removeVenuesFilters: (VenueTypeCodeKeys: VenueTypeCodeKey[]) =>
    set((state: State) => ({
      venuesFilters: difference(state.venuesFilters, VenueTypeCodeKeys),
    })),
  reset: () => set((_) => ({ venuesFilters: [] })),
}))
