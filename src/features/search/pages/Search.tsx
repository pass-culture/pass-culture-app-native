import algoliasearch from 'algoliasearch'
import React from 'react'
import { Configure, InstantSearch, connectStats } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox'
import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { _ } from 'libs/i18n'
import { env } from 'libs/environment'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const Search: React.FC = () => (
  <InstantSearch
    searchClient={algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)}
    indexName={env.ALGOLIA_INDEX_NAME}>
    <Container>
      <Spacer.TopScreen />
      <SearchBox />
      <Configure hitsPerPage={10} />
      <NumberOfResults />
      <InfiniteHits />
    </Container>
  </InstantSearch>
)

const Container = styled.View({ flex: 1, alignItems: 'center', marginHorizontal: getSpacing(6) })

const NumberOfResults = connectStats(({ nbHits }) => (
  <Typo.Caption>{nbHits.toLocaleString()} results !</Typo.Caption>
))
