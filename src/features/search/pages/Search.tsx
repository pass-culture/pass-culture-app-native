import algoliasearch from 'algoliasearch'
import React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { TAB_BAR_COMP_HEIGHT } from 'features/navigation/TabBar/TabBarComponent'
import { FilterButton } from 'features/search/atoms'
import { InfiniteHits, SearchHeader } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useKeyboardAdjust } from 'ui/components/keyboard/useKeyboardAdjust'
import { getSpacing, Spacer } from 'ui/theme'

const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export const Search: React.FC = () => {
  useKeyboardAdjust()

  return (
    <InstantSearch searchClient={searchClient} indexName={env.ALGOLIA_INDEX_NAME}>
      <Configure hitsPerPage={20} />
      <Container>
        <SearchHeader />
        <InfiniteHits />

        <FilterButtonContainer>
          <FilterButton />
          <Spacer.BottomScreen />
        </FilterButtonContainer>
      </Container>
    </InstantSearch>
  )
}

const Container = styled.View({ flex: 1 })
const FilterButtonContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})
