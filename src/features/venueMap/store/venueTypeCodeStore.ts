import { VenueTypeCode } from 'libs/parsers/venueType'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = {
  venueTypeCode: VenueTypeCode | null
}

const defaultState: State = { venueTypeCode: null }

const useVenueTypeCodeStore = createStore({ name: 'venue-map-venue-type-code', defaultState })

export const useVenueTypeCode = () => useVenueTypeCodeStore((state) => state.venueTypeCode)
export const venueTypeCodeActions = createActions(useVenueTypeCodeStore, (set) => ({
  setVenueTypeCode: (payload: VenueTypeCode | null) => set({ venueTypeCode: payload }),
}))
