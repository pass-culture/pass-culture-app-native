import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

export const Search: React.FC = () => {
  useKeyboardAdjust()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { searchState, dispatch } = useSearch()

  useEffect(() => {
    if (params?.parameters) {
      dispatch({ type: 'INIT_FROM_SEE_MORE', payload: params.parameters })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [params])

  return (
    <Container>
      <SearchHeader />
      {searchState.showResults ? <SearchResults /> : <SearchLandingPage />}
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
