import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'

export type VenueModalHookProps = {
  dismissModal: VoidFunction
  doAfterSearch?: VenueModalHookCallback
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
}

export type VenueModalHookCallback = (payload: Partial<SearchState>) => void
