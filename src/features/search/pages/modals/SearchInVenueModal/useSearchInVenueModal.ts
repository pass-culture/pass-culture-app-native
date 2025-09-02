import { useCallback, useEffect, useState } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import {
  SearchInVenueModalHook,
  SearchInVenueModalHookProps,
} from 'features/search/pages/modals/SearchInVenueModal/type'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
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
const useSearchInVenueModal = ({
  dismissModal,
}: SearchInVenueModalHookProps): SearchInVenueModalHook => {
  const [searchInVenueQuery, setSearchInVenueQuery] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const { dispatch, searchState } = useSearch()

  useEffect(() => {
    if (!searchState.venue) {
      setSearchInVenueQuery('')
    }
  }, [searchState.venue])

  const onClose = () => {
    if (searchState.venue) {
      setSearchInVenueQuery(searchState.venue.label)
      setSelectedVenue(searchState.venue)
    }
    dismissModal()
  }

  const doChangeVenue = useCallback((text: string) => {
    setSearchInVenueQuery(text)
    setSelectedVenue(null)
  }, [])

  const doResetVenue = useCallback(() => {
    setSearchInVenueQuery('')
    setSelectedVenue(null)
    const payload: SearchState = {
      ...searchState,
      venue: undefined,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })
  }, [dispatch, searchState])

  const doSetSelectedVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    setSearchInVenueQuery(venue.label)
  }, [])

  const doApplySearch = useCallback(() => {
    const payload: SearchState = {
      ...searchState,
      venue: selectedVenue ?? undefined,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })
    if (selectedVenue) analytics.logUserSetVenue({ venueLabel: selectedVenue.label })

    dismissModal()
  }, [dismissModal, dispatch, searchState, selectedVenue])

  useEffect(() => {
    if (searchState.venue) {
      setSearchInVenueQuery(searchState.venue.label)
      setSelectedVenue(searchState.venue)
    }
  }, [searchState.venue])

  const debouncedVenueQuery = useDebounceValue(setSearchInVenueQuery, 500)
  const isQueryProvided = !!searchInVenueQuery && !!debouncedVenueQuery
  const isSearchButtonDisabled = !selectedVenue && !!searchInVenueQuery
  const isResetButtonDisabled = !selectedVenue

  return {
    doChangeVenue,
    doResetVenue,
    doSetSelectedVenue,
    doApplySearch,
    isQueryProvided,
    searchInVenueQuery,
    isSearchButtonDisabled,
    isResetButtonDisabled,
    onClose,
  }
}

export default useSearchInVenueModal
