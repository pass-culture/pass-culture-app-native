import { useState, useCallback } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { Venue } from 'features/venue/types'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

type VenueModalHook = {
  doChangeVenue: (text: string) => void
  doResetVenue: VoidFunction
  doSetSelectedVenue: (venue: Venue) => void
  doApplySearch: VoidFunction
  isQueryProvided: boolean
  shouldShowSuggestedVenues: boolean
  isVenueSelected: boolean
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
const useVenueModal = (dismissModal: VoidFunction): VenueModalHook => {
  const [venueQuery, setVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const { dispatch } = useSearch()

  const doChangeVenue = useCallback((text: string) => {
    setVenueQuery(text)
    setSelectedVenue(null)
  }, [])

  const doResetVenue = useCallback(() => {
    setVenueQuery('')
    setSelectedVenue(null)
  }, [])

  const doSetSelectedVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    setVenueQuery(venue.label)
  }, [])

  const doApplySearch = useCallback(() => {
    if (selectedVenue)
      dispatch({
        type: 'SET_LOCATION_VENUE',
        payload: selectedVenue as Venue,
      })
    dismissModal()
  }, [dismissModal, dispatch, selectedVenue])

  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    isQueryProvided,
    shouldShowSuggestedVenues,
    isVenueSelected: !!selectedVenue,
    venueQuery,
  }
}

export default useVenueModal
