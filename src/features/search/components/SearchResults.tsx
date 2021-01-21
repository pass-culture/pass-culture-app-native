import React from 'react'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { Filter } from 'features/search/atoms/Buttons'
import { InfiniteHits } from 'features/search/components'
import { getSpacing, Spacer } from 'ui/theme'

export const SearchResults: React.FC = () => (
  <React.Fragment>
    <InfiniteHits />

    <FilterContainer>
      <Filter />
      <Spacer.BottomScreen />
    </FilterContainer>
  </React.Fragment>
)

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})
