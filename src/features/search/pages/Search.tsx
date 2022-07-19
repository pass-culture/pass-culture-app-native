import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { useShowResultsForCategory } from 'features/search/pages/useShowResultsForCategory'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const searchInputID = uuidv4()

export function Search() {
  const netInfo = useNetInfo()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const [isFocus, setIsFocus] = useState(false)
  const showResultsForCategory = useShowResultsForCategory()

  useEffect(() => {
    dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params || { showResults: false } })
  }, [dispatch, params])

  const bodySearch = () => {
    if (showResults || isFocus) return <SearchDetails />
    return (
      <Container>
        <CategoriesButtons onCategoryPress={showResultsForCategory} />
        <Spacer.TabBar />
      </Container>
    )
  }

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Form.Flex>
      <SearchHeader searchInputID={searchInputID} onFocusState={setIsFocus} isFocus={isFocus} />
      {bodySearch()}
    </Form.Flex>
  )
}

const Container = styled.View({ flex: 1 })
