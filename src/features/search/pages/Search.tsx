import { t } from '@lingui/macro'
import algoliasearch from 'algoliasearch'
import React from 'react'
import styled from 'styled-components/native'
import { InstantSearch, connectStats } from 'react-instantsearch-native'

import { _ } from 'libs/i18n'
import { env } from 'libs/environment'
import { Spacer, Typo } from 'ui/theme'

export const Search: React.FC = () => (
  <Container>
    <InstantSearch
      searchClient={algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)}
      indexName={env.ALGOLIA_INDEX_NAME}>
      <Spacer.Flex />
      <Typo.Hero>{_(t`Search`)}</Typo.Hero>
      <NumberOfResults />
      <Spacer.Flex />
    </InstantSearch>
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })

const NumberOfResults = connectStats(({ nbHits }) => (
  <Typo.Caption>{nbHits.toLocaleString()} results !</Typo.Caption>
))
