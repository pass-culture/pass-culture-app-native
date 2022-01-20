import { useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { Form } from 'ui/web/form/Form'

import { useSearchResults } from './useSearchResults'

const useShowResults = () => {
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

export function Search() {
  useKeyboardAdjust()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [params])

  return (
    <Container>
      <Form.Flex>
        <SearchHeader />
        {showResults ? <SearchResults /> : <SearchLandingPage />}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
