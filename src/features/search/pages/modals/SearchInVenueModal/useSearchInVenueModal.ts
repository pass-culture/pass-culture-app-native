import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
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
