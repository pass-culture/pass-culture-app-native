import { useCallback, useState } from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import {
  SearchInVenueModalHook,
  SearchInVenueModalHookProps,
} from 'features/search/pages/modals/SearchInVenueModal/type'
import { SearchState } from 'features/search/types'

export const useSearchInVenueModal = ({
  dismissModal,
  venueSelected,
  onBeforeNavigate,
}: SearchInVenueModalHookProps): SearchInVenueModalHook => {
  const [searchInVenueQuery, setSearchInVenueQuery] = useState('')
  const { dispatch } = useSearch()
  const { navigateToSearch } = useNavigateToSearch('SearchResults')

  const onClose = () => {
    setSearchInVenueQuery('')
    dismissModal()
  }

  const doResetVenue = () => {
    setSearchInVenueQuery('')
  }

  const doApplySearch = useCallback(() => {
    onBeforeNavigate()
    const payload: SearchState = {
      ...initialSearchState,
      venue: venueSelected,
      query: searchInVenueQuery,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })
    dismissModal()
    navigateToSearch(payload)
  }, [
    dismissModal,
    dispatch,
    navigateToSearch,
    onBeforeNavigate,
    searchInVenueQuery,
    venueSelected,
  ])

  const isSearchButtonDisabled = searchInVenueQuery.trim().length === 0

  return {
    doApplySearch,
    doResetVenue,
    searchInVenueQuery,
    isSearchButtonDisabled,
    setSearchInVenueQuery,
    onClose,
    onBeforeNavigate,
  }
}
