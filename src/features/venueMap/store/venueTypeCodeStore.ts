import { VenueTypeCode } from 'libs/parsers/venueType'
import { createStore } from 'libs/store/createStore'

type State = {
  venueTypeCode: VenueTypeCode | null
}

const defaultState: State = { venueTypeCode: null }

const setActions = (set: (payload: State) => void) => ({
  setVenueTypeCode: (payload: VenueTypeCode | null) => set({ venueTypeCode: payload }),
})

const useVenueTypeCodeStore = createStore<State, ReturnType<typeof setActions>>(
  'venue-map-venue-type-code',
  defaultState,
  setActions
)

export const useVenueTypeCode = () => useVenueTypeCodeStore((state) => state.venueTypeCode)
export const useVenueTypeCodeActions = () => useVenueTypeCodeStore((state) => state.actions)
