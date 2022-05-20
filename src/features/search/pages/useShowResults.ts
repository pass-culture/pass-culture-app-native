import { useEffect, useRef, useState } from 'react'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { useSearchResults } from 'features/search/pages/useSearchResults'

export const useShowResults = () => {
  const timer = useRef<number>()
  const { searchState } = useSearch()
  const [showResults, setShowResults] = useState<boolean>(searchState.showResults)
  const { isLoading } = useSearchResults()

  useEffect(() => {
    if (searchState.showResults) {
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
  }, [searchState.showResults, isLoading])

  return showResults
}
