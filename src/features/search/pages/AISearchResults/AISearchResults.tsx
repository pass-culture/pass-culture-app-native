import { Hit } from '@algolia/client-search'
import { useNavigationState } from '@react-navigation/native'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { useSync } from 'features/search/helpers/useSync/useSync'
import { useMagicAPI } from 'features/search/queries/useMagicAPI'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { ScrollView, StatusBar } from 'react-native'
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
  useSync(currentRoute === 'SearchResults' || currentRoute === 'AISearchResults')

  const netInfo = useNetInfoContext()
  const { setQueryHistory, addToHistory } = useSearchHistory()

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  const { searchState } = useSearch()

  const renderPassPlaylist = useRenderPassPlaylist({
    analyticsFrom: 'hackatonaisearch',
    route: 'ThematicSearch',
    playlist: { title: '', offers: { hits: [] } },
  })

  console.log(searchState)

  // const { data: magicApiData } = useMagicAPI(searchState.query)
  // console.log(magicApiData)

  // const { best, discover } = magicApiData ?? {}
  const bestOfferIds = ['230622476', '95010170', '75363381', '265581209', '78094779']
  const bestSummary = 'Les suggestions basées sur ta recherche'
  const discoverOfferIds = ['315872125', '313483756', '318013399', '90910957', '315308351']
  const discoverSummary = 'Pour aller plus loin'
  // const bestHits = (best && useAlgoliaSimilarOffers(best.offers.map((item) => item.offerId))) ?? []

  const bestHits = useAlgoliaSimilarOffers(bestOfferIds) ?? []
  const discoverHits = useAlgoliaSimilarOffers(discoverOfferIds) ?? []

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  // const hits = bestHits.slice(0, 5).concat(discoverHits.slice(0, 5))
  console.log(bestHits)
  console.log(discoverHits)
  return (
    <Page>
      <ScrollView>
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
              data={bestHits}
              itemWidth={PLAYLIST_ITEM_WIDTH}
              itemHeight={PLAYLIST_ITEM_HEIGHT}
              renderItem={renderPassPlaylist}
              keyExtractor={(item: Hit<Offer>) => item.objectID}
              title={bestSummary ?? 'Les meilleures offres pour toi'}
              noMarginBottom
            />
            <Spacer.Column numberOfSpaces={2} />
            <PassPlaylist
              data={discoverHits}
              itemWidth={PLAYLIST_ITEM_WIDTH}
              itemHeight={PLAYLIST_ITEM_HEIGHT}
              renderItem={renderPassPlaylist}
              keyExtractor={(item: Hit<Offer>) => item.objectID}
              title={discoverSummary ?? 'Ça peut aussi te plaire'}
              noMarginBottom
            />
          </InstantSearch>
        </Form.Flex>
      </ScrollView>
    </Page>
  )
}
