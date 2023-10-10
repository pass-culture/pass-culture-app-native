import { useState } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { Venue } from 'features/venue/types'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

type VenueModalHook = {
  doChangeVenue: (text: string) => void
  doResetVenue: () => void
  doSetSelectedVenue: (venue: Venue) => void
  doApplySearch: () => void
  isQueryProvided: boolean
  shouldShowSuggestedVenues: boolean
  isVenueNotSelected: boolean
  venueQuery: string
}

/**
 * Build the logic of the modal so buttons are only shown
 * when the input venue query has been filled
 * by a click on the selected dropdown venue list
 * It can then apply the "search" by changing the search context
 *
 * @param dismissModal callback to close modal passed by parent component
 * @returns
 */
const useVenueModal = (dismissModal: () => void | null): VenueModalHook => {
  const [venueQuery, setVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const { dispatch, searchState } = useSearch()

  const doChangeVenue = (text: string) => {
    setVenueQuery(text)
    setSelectedVenue(null)
  }
  const doResetVenue = () => {
    setVenueQuery('')
    setSelectedVenue(null)
  }

  const doSetSelectedVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setVenueQuery(venue.label)
  }

  const doApplySearch = () => {
    if (selectedVenue)
      dispatch({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          locationFilter: {
            locationType: LocationType.VENUE,
            venue: selectedVenue as Venue,
          },
        },
      })
    dismissModal?.()
  }

  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue
  const isVenueNotSelected = !selectedVenue

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    isQueryProvided,
    shouldShowSuggestedVenues,
    isVenueNotSelected,
    venueQuery,
  }
}

export default useVenueModal
