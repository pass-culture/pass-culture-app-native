import { useCallback, useEffect, useState } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { VenueModalHook, VenueModalHookProps } from 'features/search/pages/modals/VenueModal/type'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

/**
 * Build the logic of the modal so buttons are only shown
 * when the input venue query has been filled
 * by a click on the selected dropdown venue list
 * It can then apply the "search" by changing the search context
 *
 * @param dismissModal callback to close modal passed by parent component
 * @returns
 */
const useVenueModal = ({ dismissModal, doAfterSearch }: VenueModalHookProps): VenueModalHook => {
  const [venueQuery, setVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const { dispatch, searchState } = useSearch()

  useEffect(() => {
    if (!searchState.venue) {
      setVenueQuery('')
    }
  }, [searchState.venue])

  const onClose = () => {
    if (searchState.venue) {
      setVenueQuery(searchState.venue.label)
    }
    dismissModal()
  }

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
    const payload: Partial<SearchState> = {
      ...searchState,
      venue: selectedVenue ?? undefined,
      view: SearchView.Results,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })
    if (selectedVenue) analytics.logUserSetVenue({ venueLabel: selectedVenue.label })
    doAfterSearch?.(payload)

    dismissModal()
  }, [dismissModal, dispatch, doAfterSearch, searchState, selectedVenue])

  useEffect(() => {
    if (searchState.venue) {
      setVenueQuery(searchState.venue.label)
      setSelectedVenue(searchState.venue)
    }
  }, [searchState.venue])

  const debouncedVenueQuery = useDebounceValue(venueQuery, 500)
  const isQueryProvided = !!venueQuery && !!debouncedVenueQuery
  const shouldShowSuggestedVenues = isQueryProvided && !selectedVenue
  const isSearchButtonDisabled = !selectedVenue && !!venueQuery

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    isQueryProvided,
    shouldShowSuggestedVenues,
    venueQuery,
    isSearchButtonDisabled,
    onClose,
  }
}

export default useVenueModal
