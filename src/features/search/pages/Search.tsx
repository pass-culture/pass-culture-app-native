import algoliasearch from 'algoliasearch'
import React from 'react'
import {
  Configure,
  connectCurrentRefinements,
  InstantSearch,
  connectStats,
} from 'react-instantsearch-native'
import styled from 'styled-components/native'

import { CategoryFilter } from 'features/search/components/CategoryFilter'
import { SearchBox } from 'features/search/components/SearchBox'
import { InfiniteHits } from 'features/search/components/InfiniteHits'
import { _ } from 'libs/i18n'
import { env } from 'libs/environment'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const Search: React.FC = () => (
  <InstantSearch
    searchClient={algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)}
    indexName={env.ALGOLIA_INDEX_NAME}
    onSearchStateChange={(_searchState) => null}>
    <Container>
      <Spacer.TopScreen />
      <SearchBox />
      <ClearRefinements />
      <Configure hitsPerPage={10} />
      <Configure attributesToRetrieve={['offer.name', 'offer.thumbUrl']} />
      <CategoryFilter attribute="offer.category" operator="or" />
      <NumberOfResults />
      <InfiniteHits />
    </Container>
  </InstantSearch>
)

const Container = styled.View({ flex: 1, alignItems: 'center', marginHorizontal: getSpacing(6) })

const NumberOfResults = connectStats(({ nbHits }) => (
  <Typo.Caption>{nbHits.toLocaleString()} results !</Typo.Caption>
))

const ClearRefinements = connectCurrentRefinements(({ refine, items }) => (
  <ButtonPrimary title="Réinitialiser" onPress={() => refine(items)} />
))
