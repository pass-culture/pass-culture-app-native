import { difference } from 'lodash'

import { VenueTypeCodeKey } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State = {
  venuesFilters: VenueTypeCodeKey[]
}

const defaultState: State = {
  venuesFilters: [],
}

const setActions = (set: (payload: (state: State) => State) => void) => ({
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
})

const useVenuesFilterStore = createStore<State, ReturnType<typeof setActions>>(
  'venue-VenuesFilterilter',
  defaultState,
  setActions
)

export const useVenuesFilter = () => useVenuesFilterStore((state) => state.venuesFilters)
export const useVenuesFilterActions = () => useVenuesFilterStore((state) => state.actions)
