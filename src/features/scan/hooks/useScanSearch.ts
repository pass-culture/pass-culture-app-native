import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { v4 } from 'uuid'

// import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
// import { checkIsISBN } from 'features/scan/utils/isISBN'
import { uploadImage } from 'features/scan/utils/uploadImage'
import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { useSearch } from 'features/search/context/SearchWrapper'
// import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { SearchState } from 'features/search/types'

const API_URL = 'http://localhost:8000/'
export const useScanSearch = () => {
  const { searchState, dispatch, resetSearch } = useSearch()
  const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
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

      await refetch()
      const { data } = await fetchNextPage()
      const firstPage = data?.pages[0]
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
    [fetchNextPage, navigate, refetch, resetSearch, searchState.searchId, setSearch]
  )

  const searchByImage = useCallback(async (path: string) => {
    setIsLoading(true)
    const response = uploadImage(API_URL, path)
    setIsLoading(false)
    console.log({ response })
  }, [])

  const search = useCallback(
    async (query: string) => {
      // const isISBN = checkIsISBN(query)

      // isISBN ? searchByISBN(query) : searchByText(query)
      await searchByISBN(query)
    },
    [searchByISBN]
  )

  return { search, isLoading: isSearchByISBNLoading, showErrorBanner, searchByImage }
}

// requête

// curl -X 'POST' \
//   'http://127.0.0.1:8000/predict' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: multipart/form-data' \
//   -F 'image=@bluelock1.jpg;type=image/jpeg'

// réponse

const r: Response = {
  item_id: 'offer-89941585',
  offer_id: '89941585',
  offer_name: 'Blue Lock tome 1',
  vector_norm: 0.9999998907920478,
  _distance: 0.2853059768676758,
  url: 'https://passculture.app/offre/89941585',
}

type Response = {
  item_id: string
  offer_id: string
  offer_name: string
  vector_norm: number
  _distance: number
  url: string
}

const uri = {
  photo: {
    height: 3000,
    isMirrored: false,
    isRawPhoto: false,
    orientation: 'portrait',
    path: '/data/user/0/app.passculture.testing/cache/mrousavy-9085200568011197963.jpg',
    width: 4000,
  },
}
