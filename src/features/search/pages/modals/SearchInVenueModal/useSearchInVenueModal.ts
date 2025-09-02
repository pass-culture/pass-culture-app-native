import { useCallback, useEffect, useState } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import {
  SearchInVenueModalHook,
  SearchInVenueModalHookProps,
} from 'features/search/pages/modals/SearchInVenueModal/type'
import { SearchState } from 'features/search/types'
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
  venueSelected,
}: SearchInVenueModalHookProps): SearchInVenueModalHook => {
  const [searchInVenueQuery, setSearchInVenueQuery] = useState('')
  const { dispatch, searchState } = useSearch()

  const onClose = () => {
    dismissModal()
  }


  const doApplySearch = useCallback(() => {
    const payload: SearchState = {
      ...searchState,
      venue: venueSelected,
      query: searchInVenueQuery,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })

    dismissModal()
  }, [dismissModal, dispatch, searchInVenueQuery, searchState, venueSelected])

  useEffect(() => {
    if (searchState.venue) {
      setSearchInVenueQuery(searchState.venue.label)
    }
  }, [searchState.venue])

  const debouncedVenueQuery = useDebounceValue(setSearchInVenueQuery, 500)
  const isQueryProvided = !!searchInVenueQuery && !!debouncedVenueQuery
  const isSearchButtonDisabled = !!searchInVenueQuery
  const isResetButtonDisabled = !searchInVenueQuery

  return {
    doApplySearch,
    isQueryProvided,
    searchInVenueQuery,
    isSearchButtonDisabled,
    isResetButtonDisabled,
    onClose,
  }
}

export default useSearchInVenueModal
