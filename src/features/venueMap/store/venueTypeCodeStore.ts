import { VenueTypeCode } from 'libs/parsers/venueType'
import { createStore } from 'libs/store/createStore'

type State = {
  venueTypeCode: VenueTypeCode | null
}

const defaultState: State = { venueTypeCode: null }

const venueTypeCodeStore = createStore({
  name: 'venue-map-venue-type-code',
  defaultState,
  actions: (set) => ({
    setVenueTypeCode: (venueTypeCode: VenueTypeCode | null) => set({ venueTypeCode }),
  }),
  selectors: {
    selectVenueTypeCode: () => (state) => state.venueTypeCode,
  },
})

export const venueTypeCodeActions = venueTypeCodeStore.actions
export const { useVenueTypeCode } = venueTypeCodeStore.hooks
