import { useRoute } from '@react-navigation/native'
import isEmpty from 'lodash/isEmpty'
import React from 'react'
import styled from 'styled-components/native'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchHeader, SearchLandingPage, SearchResults } from 'features/search/components'
import { SearchView } from 'features/search/enums'
import { Categories } from 'features/search/pages/Categories'
import { LocationFilter } from 'features/search/pages/LocationFilter'
import { LocationPicker } from 'features/search/pages/LocationPicker'
import { SearchFilter } from 'features/search/pages/SearchFilter'
import { useSearch, useStagedSearch, useSearchView } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'

export const Search: React.FC = () => {
  useKeyboardAdjust()
  const { params = {} } = useRoute<UseRouteType<'Search'>>()
  const { searchView, setSearchView } = useSearchView()
  const { dispatch } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()

  useDeepCompareEffect(() => {
    if (!params || isEmpty(params)) return
    const view = params.view ? params.view : SearchView.LANDING
    dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
    stagedDispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params })
    setSearchView(view)
  }, [params])

  function renderSearchView() {
    if (searchView === SearchView.LANDING) return <SearchLandingPage />
    else if (searchView === SearchView.RESULTS) return <SearchResults />
    else if (searchView === SearchView.CATEGORIES) return <Categories />
    else if (searchView === SearchView.FILTERS) return <SearchFilter />
    else if (searchView === SearchView.LOCATION_FILTERS) return <LocationFilter />
    else if (searchView === SearchView.LOCATION_ADDRESS) return <LocationPicker />
    return <SearchLandingPage />
  }

  return (
    <Container>
      <SearchHeader />
      {renderSearchView()}
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
