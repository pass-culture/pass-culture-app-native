import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchResults } from 'features/search/components'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResultsForCategory } from 'features/search/pages/useShowResultsForCategory'
import { SearchView } from 'features/search/types'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const searchInputID = uuidv4()

export function Search() {
  const netInfo = useNetInfo()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResultsForCategory = useShowResultsForCategory()

  useEffect(() => {
    dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params || { view: SearchView.Landing } })
  }, [dispatch, params])

  const bodySearch = () => {
    if (params?.view === SearchView.Suggestions)
      return <View testID="recentsSearchesAndSuggestions" />
    if (params?.view === SearchView.Results) return <SearchResults />
    return (
      <Container>
        <CategoriesButtons onPressCategory={showResultsForCategory} />
        <Spacer.TabBar />
      </Container>
    )
  }

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Form.Flex>
      <SearchHeader searchInputID={searchInputID} />
      {bodySearch()}
    </Form.Flex>
  )
}

const Container = styled.View({ flex: 1 })
