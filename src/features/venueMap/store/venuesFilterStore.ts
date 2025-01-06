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

const useVenuesFilterStore = createStore('venue-VenuesFilterilter', defaultState)

export const useVenuesFilter = () => useVenuesFilterStore((state) => state.venuesFilters)

export const venuesFilterActions = createActions(useVenuesFilterStore, (set) => ({
  setVenuesFilters: (payload: VenueTypeCodeKey[]) => set((_) => ({ venuesFilters: payload })),
  addVenuesFilters: (payload: VenueTypeCodeKey[]) =>
    set((state: State) => ({
      venuesFilters: Array.from(new Set([...state.venuesFilters, ...payload])),
    })),
  removeVenuesFilters: (payload: VenueTypeCodeKey[]) =>
    set((state: State) => ({
      venuesFilters: difference(state.venuesFilters, payload),
    })),
  reset: () => set((_) => ({ venuesFilters: [] })),
}))
