import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { useShowResultsForCategory } from 'features/search/pages/useShowResultsForCategory'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export function Search() {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()
  const [isFocus, setIsFocus] = useState(false)
  const showResultsForCategory = useShowResultsForCategory()

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
    }
  }, [dispatch, params])

  const bodySearch = () => {
    // SearchDetails will integrate recent searches and suggestions
    // To avoid blink effect when refreshing the view (due to dispatch delay), we also test params.showResults
    if (params?.showResults || showResults || isFocus) return <SearchDetails />
    return (
      <Container>
        <Spacer.Column numberOfSpaces={5} />
        <CategoriesButtons onPressCategory={showResultsForCategory} />
        <Spacer.TabBar />
      </Container>
    )
  }

  const onFocusState = useCallback((focus: boolean) => {
    setIsFocus(focus)
  }, [])

  return (
    <Container>
      <Form.Flex>
        <SearchHeader
          paramsShowResults={params?.showResults}
          searchInputID={searchInputID}
          onFocusState={onFocusState}
          isFocus={isFocus}
        />
        {bodySearch()}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
