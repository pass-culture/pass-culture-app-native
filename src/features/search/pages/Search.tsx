import { useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

import { useSearchResults } from './useSearchResults'

const useShowResults = () => {
  const timer = useRef<NodeJS.Timeout>()
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
        timer.current = setTimeout(() => {
          setShowResults(true)
        }, 20)
      }
    } else {
      setShowResults(false)
    }
    return () => timer.current && clearTimeout(timer.current)
  }, [searchState.showResults, isLoading])

  return showResults
}

export const Search: React.FC = () => {
  useKeyboardAdjust()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()

  useEffect(() => {
    if (params?.parameters) {
      dispatch({ type: 'INIT_FROM_SEE_MORE', payload: params.parameters })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [params])

  return (
    <Container>
      <SearchHeader />
      {showResults ? <SearchResults /> : <SearchLandingPage />}
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
