import { VenueTypeCode } from 'libs/parsers/venueType'
import { createStore } from 'libs/store/createStore'

type State = {
  venueTypeCode: VenueTypeCode | null
}
type Actions = {
  setVenueTypeCode: (payload: VenueTypeCode | null) => void
}

const useVenueTypeCodeStore = createStore<State, Actions>(
  'venue-map-venue-type-code',
  { venueTypeCode: null },
  (set) => ({
    setVenueTypeCode: (payload) => set({ venueTypeCode: payload }),
  })
)

export const useVenueTypeCode = () => useVenueTypeCodeStore((state) => state.venueTypeCode)
export const useVenueTypeCodeActions = () => useVenueTypeCodeStore((state) => state.actions)
