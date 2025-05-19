import { Venue } from 'features/venue/types'

export type VenueModalHookProps = {
  dismissModal: VoidFunction
}

export type VenueModalHook = {
  doChangeVenue: (text: string) => void
  doResetVenue: VoidFunction
  doSetSelectedVenue: (venue: Venue) => void
  doApplySearch: VoidFunction
  isQueryProvided: boolean
  shouldShowSuggestedVenues: boolean
  venueQuery: string
  isSearchButtonDisabled: boolean
  isResetButtonDisabled: boolean
  onClose: VoidFunction
}
