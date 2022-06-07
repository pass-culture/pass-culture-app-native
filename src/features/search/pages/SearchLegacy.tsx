import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { Form } from 'ui/web/form/Form'

export function SearchLegacy() {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [dispatch, params])

  return (
    <Container>
      <Form.Flex>
        <SearchHeader searchInputID={searchInputID} />
        {showResults ? <SearchResults /> : <SearchLandingPage />}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
