import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  SearchInVenueModalHook,
  SearchInVenueModalHookProps,
} from 'features/search/pages/modals/SearchInVenueModal/type'
import { SearchState } from 'features/search/types'

/**
 * Build the logic of the modal so buttons are only shown
 * when the input venue query has been filled
 * by a click on the selected dropdown venue list
 * It can then apply the "search" by changing the search context
 *
 * @param dismissModal callback to close modal passed by parent component
 * @returns
 */

export const useSearchInVenueModal = ({
  dismissModal,
  venueSelected,
  onBeforeNavigate,
}: SearchInVenueModalHookProps): SearchInVenueModalHook => {
  const [searchInVenueQuery, setSearchInVenueQuery] = useState('')
  const { dispatch, searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToSearch = useCallback(
    (searchState: SearchState): void => {
      navigate('TabNavigator', {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'SearchResults',
          params: {
            ...searchState,
          },
        },
      })
    },
    [navigate]
  )

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
      ...searchState,
      venue: venueSelected,
      query: searchInVenueQuery,
    }
    dispatch({
      type: 'SET_STATE',
      payload,
    })
    navigateToSearch(payload)

    dismissModal()
  }, [
    dismissModal,
    dispatch,
    navigateToSearch,
    onBeforeNavigate,
    searchInVenueQuery,
    searchState,
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

export default useSearchInVenueModal
