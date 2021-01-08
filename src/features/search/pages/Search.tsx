import algoliasearch from 'algoliasearch'
import React from 'react'
import { InstantSearch, connectStats } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox'
import { _ } from 'libs/i18n'
import { env } from 'libs/environment'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const Search: React.FC = () => (
  <Container>
    <InstantSearch
      searchClient={algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)}
      indexName={env.ALGOLIA_INDEX_NAME}>
      <Spacer.TopScreen />
      <SearchBox />
      <NumberOfResults />
    </InstantSearch>
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center', marginHorizontal: getSpacing(6) })

const NumberOfResults = connectStats(({ nbHits }) => (
  <Typo.Caption>{nbHits.toLocaleString()} results !</Typo.Caption>
))
