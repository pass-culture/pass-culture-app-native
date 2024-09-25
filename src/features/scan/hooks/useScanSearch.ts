import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { v4 } from 'uuid'

// import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
// import { checkIsISBN } from 'features/scan/utils/isISBN'
import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { useSearch } from 'features/search/context/SearchWrapper'
// import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { SearchState } from 'features/search/types'

export const useScanSearch = () => {
  const { searchState, dispatch, resetSearch } = useSearch()
  const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false)
  // const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')

  const {
    refetch,
    fetchNextPage,
    isLoading: isSearchByISBNLoading,
  } = useSearchInfiniteQuery(searchState, { enabled: false })
  const { navigate } = useNavigation<UseNavigationType>()

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

  // const searchByText = useCallback(
  //   (text: string) => {
  //     setSearch(text)
  //     navigateToSearchResults(searchState, defaultDisabilitiesProperties)
  //   },
  //   [navigateToSearchResults, searchState, setSearch]
  // )

  const searchByISBN = useCallback(
    async (isbn: string) => {
      setSearch(isbn)
      console.log('before')

      await refetch()
      const { data } = await fetchNextPage()
      const firstPage = data?.pages[0]
      console.log({ firstPage })
      if (!firstPage || !firstPage.offers.hits.length) {
        setShowErrorBanner(true)
        setTimeout(() => setShowErrorBanner(false), 1000)
        return
      }
      const offer = firstPage.offers.hits[0]
      const objectID = offer?.objectID
      const offerId = Number(objectID)

      navigate('Offer', {
        id: offerId,
        from: 'searchresults',
        searchId: searchState.searchId,
      })
      resetSearch()
    },
    [refetch, setSearch]
  )

  const search = useCallback(
    async (query: string) => {
      // const isISBN = checkIsISBN(query)

      // isISBN ? searchByISBN(query) : searchByText(query)
      await searchByISBN(query)
    },
    [searchByISBN]
  )

  return { search, isLoading: isSearchByISBNLoading, showErrorBanner }
}
