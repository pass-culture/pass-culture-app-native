import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeaderRework } from 'features/search/components/SearchHeaderRework'
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
  const { data: appSettings } = useAppSettings()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const bodySearch = () => {
    if (showResults && !appEnableSearchHomepageRework) return <SearchResults />
    // SearchDetails intégrera les recherches récentes et les suggestions
    if (appEnableSearchHomepageRework && (showResults || isFocus)) return <SearchDetails />
    return <SearchLandingPage />
  }

  return (
    <Container>
      <Form.Flex>
        {appEnableSearchHomepageRework ? (
          <SearchHeaderRework
            searchInputID={searchInputID}
            onFocusState={(focus: boolean) => {
              if (appEnableSearchHomepageRework) setIsFocus(focus)
            }}
            isFocus={isFocus}
          />
        ) : (
          <SearchHeader searchInputID={searchInputID} />
        )}
        {bodySearch()}
      </Form.Flex>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
