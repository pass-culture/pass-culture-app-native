import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { Form } from 'ui/web/form/Form'

export function Search() {
  useKeyboardAdjust()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: appSettings } = useAppSettings()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })

      if (appEnableSearchHomepageRework && params.query !== '') navigate('SearchDetails')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <Container>
      <Form.Flex>
        <SearchHeader searchInputID={searchInputID} />
        {showResults && !appEnableSearchHomepageRework ? <SearchResults /> : <SearchLandingPage />}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
