import { useRoute } from '@react-navigation/native'
import { SearchClient } from 'algoliasearch'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { memo, useEffect } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-hooks'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete/SearchAutocomplete'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem/SearchAutocompleteItem'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { InsightsMiddleware } from 'libs/algolia/analytics/InsightsMiddleware'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { Form } from 'ui/components/Form'
import { Spacer } from 'ui/theme'

const searchInputID = uuidv4()
const searchClient: SearchClient = {
  ...client,
  search(requests) {
    if (requests.every(({ params }) => !params?.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 0,
          processingTimeMS: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }
    return client.search(requests)
  },
}
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

type BodySearchProps = {
  view?: SearchView
}

const BodySearch = memo(function BodySearch({ view }: BodySearchProps) {
  const showResultsForCategory = useShowResultsForCategory()

  if (view === SearchView.Suggestions) {
    return (
      <React.Fragment>
        <SearchAutocomplete hitComponent={Hit} />
      </React.Fragment>
    )
  } else if (view === SearchView.Results) {
    return <SearchResults />
  }
  return (
    <Container>
      <CategoriesButtons onPressCategory={showResultsForCategory} />
      <Spacer.TabBar />
    </Container>
  )
})

export function Search() {
  const netInfo = useNetInfoContext()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()

  useEffect(() => {
    dispatch({ type: 'SET_STATE', payload: params || { view: SearchView.Landing } })
  }, [dispatch, params])

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch searchClient={searchClient} indexName={suggestionsIndex}>
          <Configure hitsPerPage={5} clickAnalytics />
          <InsightsMiddleware />
          <SearchHeader searchInputID={searchInputID} />
          <BodySearch view={params?.view} />
        </InstantSearch>
      </Form.Flex>
    </React.Fragment>
  )
}

const Container = styled.View({
  flex: 1,
  overflowY: 'auto',
})

export type HitProps = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
  shouldShowCategory?: boolean
}

export function Hit({ hit, sendEvent, shouldShowCategory }: HitProps) {
  return (
    <SearchAutocompleteItem
      hit={hit}
      sendEvent={sendEvent}
      shouldShowCategory={shouldShowCategory}
    />
  )
}
