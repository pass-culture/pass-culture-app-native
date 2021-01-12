import algoliasearch from 'algoliasearch'
import React from 'react'
import { InstantSearch } from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { env } from 'libs/environment'

const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export const Search: React.FC = () => (
  <InstantSearch searchClient={searchClient} indexName={env.ALGOLIA_INDEX_NAME}>
    <Container>
      <SearchHeader />
      <InfiniteHits />
    </Container>
  </InstantSearch>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
