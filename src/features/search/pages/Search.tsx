import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { FilterButton } from 'features/search/atoms'
import { InfiniteHits, SearchHeader } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { getSpacing, Spacer } from 'ui/theme'

export const Search: React.FC = () => {
  useKeyboardAdjust()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()

  useEffect(() => {
    if (params?.parameters) {
      dispatch({ type: 'INIT_FROM_SEE_MORE', payload: params.parameters })
    }
  }, [params])

  return (
    <Container>
      <SearchHeader />
      <InfiniteHits />

      <FilterButtonContainer>
        <FilterButton />
        <Spacer.BottomScreen />
      </FilterButtonContainer>
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
const FilterButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})
