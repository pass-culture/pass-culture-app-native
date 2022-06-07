import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchLandingPage } from 'features/search/components'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { SearchHeaderRework } from 'features/search/components/SearchHeaderRework'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { Form } from 'ui/web/form/Form'

export function SearchRework() {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const showResults = useShowResults()
  const searchInputID = uuidv4()
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    if (params) {
      dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
      dispatch({ type: 'SHOW_RESULTS', payload: true })
    }
  }, [dispatch, params])

  const bodySearch = () => {
    // SearchDetails intégrera les recherches récentes et les suggestions
    if (showResults || isFocus) return <SearchDetails />
    return <SearchLandingPage />
  }

  const onFocusState = (focus: boolean) => {
    setIsFocus(focus)
  }

  return (
    <Container>
      <Form.Flex>
        <SearchHeaderRework
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
