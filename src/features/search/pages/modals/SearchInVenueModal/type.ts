import { VenueResponse } from 'api/gen'

export type SearchInVenueModalHookProps = {
  dismissModal: VoidFunction
  venueSelected: VenueResponse
}

export type SearchInVenueModalHook = {
  doApplySearch: VoidFunction
  isQueryProvided: boolean
  searchInVenueQuery: string
  isSearchButtonDisabled: boolean
  isResetButtonDisabled: boolean
  onClose: VoidFunction
}
