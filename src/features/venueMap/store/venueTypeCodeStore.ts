import { VenueTypeCode } from 'libs/parsers/venueType'
import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type State = {
  venueTypeCode: VenueTypeCode | null
}

const defaultState: State = { venueTypeCode: null }

const useVenueTypeCodeStore = createConfiguredStore({
  name: 'venue-map-venue-type-code',
  defaultState,
})

export const useVenueTypeCode = () => useVenueTypeCodeStore((state) => state.venueTypeCode)
export const venueTypeCodeActions = createActions(useVenueTypeCodeStore, (set) => ({
  setVenueTypeCode: (venueTypeCode: VenueTypeCode | null) => set({ venueTypeCode }),
}))
