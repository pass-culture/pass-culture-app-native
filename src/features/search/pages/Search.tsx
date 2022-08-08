import { useRoute } from '@react-navigation/native'
import { SearchClient } from 'algoliasearch'
import React, { memo, useEffect } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-hooks'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { SearchResults } from 'features/search/components'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useShowResultsForCategory } from 'features/search/pages/useShowResultsForCategory'
import { SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { OfflinePage } from 'libs/network/OfflinePage'
import { useNetInfo } from 'libs/network/useNetInfo'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

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
  appEnableAutocomplete?: boolean
}

const BodySearch = memo(function BodySearch({ view, appEnableAutocomplete }: BodySearchProps) {
  const showResultsForCategory = useShowResultsForCategory()

  if (view === SearchView.Suggestions) {
    return (
      <React.Fragment>
        {!!appEnableAutocomplete && <SearchAutocomplete hitComponent={Hit} />}
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
  const netInfo = useNetInfo()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const { data: appSettings } = useAppSettings()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete ?? false

  useEffect(() => {
    dispatch({ type: 'SET_STATE_FROM_NAVIGATE', payload: params || { view: SearchView.Landing } })
  }, [dispatch, params])

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Form.Flex>
      {appEnableAutocomplete ? (
        <InstantSearch searchClient={searchClient} indexName={suggestionsIndex}>
          <Configure hitsPerPage={5} />
          <SearchHeader
            searchInputID={searchInputID}
            appEnableAutocomplete={appEnableAutocomplete}
          />
          <BodySearch view={params?.view} appEnableAutocomplete={appEnableAutocomplete} />
        </InstantSearch>
      ) : (
        <React.Fragment>
          <SearchHeader
            searchInputID={searchInputID}
            appEnableAutocomplete={appEnableAutocomplete}
          />
          <BodySearch view={params?.view} appEnableAutocomplete={appEnableAutocomplete} />
        </React.Fragment>
      )}
    </Form.Flex>
  )
}

const Container = styled.View({ flex: 1 })

export type HitProps = {
  hit: AlgoliaSuggestionHit
}

export function Hit({ hit }: HitProps) {
  return <SearchAutocompleteItem hit={hit} />
}
