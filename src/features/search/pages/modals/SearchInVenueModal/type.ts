import { Venue } from 'features/venue/types'

export type SearchInVenueModalHookProps = {
  dismissModal: VoidFunction
}

export type SearchInVenueModalHook = {
  doChangeVenue: (text: string) => void
  doResetVenue: VoidFunction
  doSetSelectedVenue: (venue: Venue) => void
  doApplySearch: VoidFunction
  isQueryProvided: boolean
  searchInVenueQuery: string
  isSearchButtonDisabled: boolean
  isResetButtonDisabled: boolean
  onClose: VoidFunction
}
