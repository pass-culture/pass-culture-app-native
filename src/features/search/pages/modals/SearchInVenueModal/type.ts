import { Venue } from 'features/venue/types'

export type SearchInVenueModalHookProps = {
  dismissModal: VoidFunction
  venueSelected: Venue
  onBeforeNavigate: VoidFunction
}

export type SearchInVenueModalHook = {
  doApplySearch: VoidFunction
  searchInVenueQuery: string
  setSearchInVenueQuery: (text: string) => void
  isSearchButtonDisabled: boolean
  doResetVenue: VoidFunction
  onClose: VoidFunction
  onBeforeNavigate: VoidFunction
}
