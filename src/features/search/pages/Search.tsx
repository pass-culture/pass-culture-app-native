import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { FilterButton } from 'features/search/atoms'
import { InfiniteHits, SearchHeader } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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

      {searchState.showResults ? (
        <React.Fragment>
          <InfiniteHits />

          <FilterButtonContainer>
            <FilterButton />
            <Spacer.BottomScreen />
          </FilterButtonContainer>
        </React.Fragment>
      ) : (
        <WhatAmISearching />
      )}
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
const FilterButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

const CenterContainer = styled.View({ alignItems: 'center' })

const WhatAmISearching = () => {
  const { searchState } = useSearch()
  return (
    <CenterContainer>
      <Spacer.TopScreen />
      <Typo.Hero>{_(t`Je cherche`)}</Typo.Hero>
      <Typo.Caption>{searchState.offerCategories.join('\n')}</Typo.Caption>
      <Typo.Hero>{_(t`Où`)}</Typo.Hero>
      <Typo.Caption>{searchState.searchAround}</Typo.Caption>
      <Spacer.BottomScreen />
    </CenterContainer>
  )
}
