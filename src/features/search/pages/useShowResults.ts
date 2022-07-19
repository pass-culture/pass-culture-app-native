import { useRoute } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useSearchResults } from 'features/search/pages/useSearchResults'
import { SearchView } from 'features/search/types'

export const useShowResults = () => {
  const timer = useRef<number>()
  const { searchState } = useSearch()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const initialShowResults =
    params?.view === SearchView.Results || searchState.view === SearchView.Results // To avoid blink effect when refreshing the view (due to dispatch delay), we also test params.view
  const [showResults, setShowResults] = useState<boolean>(initialShowResults)
  const { isLoading } = useSearchResults()

  useEffect(() => {
    if (initialShowResults) {
      if (!isLoading) {
        setShowResults(true)
      } else {
        // For most networks, 20ms is enough time to fetch the results fom Algolia
        // In this case we can avoid displaying the placeholders
        timer.current = globalThis.setTimeout(() => {
          setShowResults(true)
        }, 20)
      }
    } else {
      setShowResults(false)
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [initialShowResults, isLoading])

  return showResults
}
