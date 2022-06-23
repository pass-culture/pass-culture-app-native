import { useRoute } from '@react-navigation/native'
import algoliasearch from 'algoliasearch'
import React, { useCallback, useEffect, useState } from 'react'
import { InstantSearch } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchLandingPage } from 'features/search/components'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeaderRework } from 'features/search/components/SearchHeaderRework'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { env } from 'libs/environment'
import { Form } from 'ui/web/form/Form'

const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export function SearchRework() {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()
  const [isFocus, setIsFocus] = useState(false)
  const offersIndex = env.ALGOLIA_OFFERS_INDEX_NAME

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [dispatch, params])

  const bodySearch = () => {
    // SearchDetails will integrate recent searches and suggestions
    if (showResults || isFocus) return <SearchDetails isFocus={isFocus} />
    return <SearchLandingPage />
  }

  const onFocusState = useCallback((focus: boolean) => {
    setIsFocus(focus)
  }, [])

  return (
    <Container>
      <Form.Flex>
        <InstantSearch searchClient={searchClient} indexName={offersIndex}>
          <SearchHeaderRework
            searchInputID={searchInputID}
            onFocusState={onFocusState}
            isFocus={isFocus}
          />
          {bodySearch()}
        </InstantSearch>
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
