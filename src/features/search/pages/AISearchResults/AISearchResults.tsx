import { Hit } from '@algolia/client-search'
import { useNavigationState } from '@react-navigation/native'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { StatusBar } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { Form } from 'ui/components/Form'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { Page } from 'ui/pages/Page'
import { LENGTH_M, RATIO_HOME_IMAGE, Spacer } from 'ui/theme'
import { v4 as uuidv4 } from 'uuid'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

const PLAYLIST_ITEM_HEIGHT = LENGTH_M
const PLAYLIST_ITEM_WIDTH = LENGTH_M * RATIO_HOME_IMAGE

export const AISearchResults = () => {
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.at(-1)?.name
  // useSync(currentRoute === 'SearchResults')

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  const renderPassPlaylist = useRenderPassPlaylist({
    analyticsFrom: 'hackatonaisearch',
    route: 'ThematicSearch',
    playlist: { title: '', offers: { hits: [] } },
  })
  const mockOfferIds = ['315872631', '319006918', '292186344']
  const hits = useAlgoliaSimilarOffers(mockOfferIds)
  if (!hits) return null
  return (
    <Page>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />
          <SearchHeader
            searchInputID={searchInputID}
            addSearchHistory={addToHistory}
            searchInHistory={setQueryHistoryMemoized}
          />
          <Spacer.Column numberOfSpaces={2} />
          <PassPlaylist
            data={hits}
            itemWidth={PLAYLIST_ITEM_WIDTH}
            itemHeight={PLAYLIST_ITEM_HEIGHT}
            renderItem={renderPassPlaylist}
            keyExtractor={(item: Hit<Offer>) => item.objectID}
            title={'Les meilleures offres pour toi'}
            noMarginBottom
          />
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}
