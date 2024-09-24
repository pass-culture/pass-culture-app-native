import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'
import { v4 } from 'uuid'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { checkIsISBN } from 'features/scan/utils/isISBN'
import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { SearchState } from 'features/search/types'

export const useScanSearch = () => {
  const { searchState, dispatch } = useSearch()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const {
    hits,
    fetchNextPage,
    isLoading: isSearchByISBNLoading,
    isFetched,
  } = useSearchInfiniteQuery(searchState, { enabled: false })
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    if (!isFetched) {
      return
    }
    if (!hits.offers.length) {
      throw new Error('résultat par ISBN introuvable')
    }
    const offer = hits.offers[0]
    const objectID = offer?.objectID

    const offerId = Number(objectID)

    navigate('Offer', {
      id: offerId,
      from: 'searchresults',
      searchId: searchState.searchId,
    })
  }, [hits.offers, navigate, searchState.searchId, isFetched])

  const setSearch = useCallback(
    (query: string) => {
      const searchId = v4()

      const newSearchState: SearchState = { ...searchState, query, searchId }
      dispatch({
        type: 'SET_STATE',
        payload: newSearchState,
      })
    },
    [dispatch, searchState]
  )

  const searchByText = useCallback(
    (text: string) => {
      setSearch(text)
      navigateToSearchResults(searchState, defaultDisabilitiesProperties)
    },
    [navigateToSearchResults, searchState, setSearch]
  )

  const searchByISBN = useCallback(
    (isbn: string) => {
      setSearch(isbn)
      fetchNextPage()
    },
    [fetchNextPage, setSearch]
  )

  const search = useCallback(
    (query: string) => {
      const isISBN = checkIsISBN(query)

      isISBN ? searchByISBN(query) : searchByText(query)
    },
    [searchByISBN, searchByText]
  )

  return { search, isLoading: isSearchByISBNLoading }
}
