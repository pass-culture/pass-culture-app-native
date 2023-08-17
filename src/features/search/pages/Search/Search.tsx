import { useRoute } from '@react-navigation/native'
import { SearchClient } from 'algoliasearch'
import React, { useEffect, useMemo } from 'react'
import { Configure, Index, InstantSearch } from 'react-instantsearch-hooks'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { BodySearch } from 'features/search/components/BodySearch/BodySearch'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchView } from 'features/search/types'
import { InsightsMiddleware } from 'libs/algolia/analytics/InsightsMiddleware'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { buildSearchVenuePosition } from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/helpers/buildSearchVenuePosition'
import { getCurrentVenuesIndex } from 'libs/algolia/fetchAlgolia/helpers/getCurrentVenuesIndex'
import { env } from 'libs/environment'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGeolocation } from 'libs/geolocation'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { Form } from 'ui/components/Form'
import { Spacer, getSpacing } from 'ui/theme'

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

export function Search() {
  const netInfo = useNetInfoContext()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { dispatch } = useSearch()
  const { userPosition } = useGeolocation()

  useEffect(() => {
    dispatch({ type: 'SET_STATE', payload: params ?? { view: SearchView.Landing } })
  }, [dispatch, params])

  const currentView = useMemo(() => params?.view, [params?.view])

  const searchVenuePosition = useMemo(
    () => buildSearchVenuePosition(params?.locationFilter, userPosition),
    [params?.locationFilter, userPosition]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  const currentVenuesIndex = getCurrentVenuesIndex(params?.locationFilter?.locationType)

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <Form.Flex>
        <InstantSearch searchClient={searchClient} indexName={suggestionsIndex}>
          <Configure hitsPerPage={5} clickAnalytics />
          <InsightsMiddleware />
          <SearchHeader searchInputID={searchInputID} searchView={currentView} />
          {currentView === SearchView.Suggestions ? (
            <StyledScrollView keyboardShouldPersistTaps="handled">
              <Spacer.Column numberOfSpaces={4} />
              <AutocompleteOffer />
              <FeatureFlag
                featureFlag={RemoteStoreFeatureFlags.WIP_ENABLE_VENUES_IN_SEARCH_RESULTS}>
                <Index indexName={currentVenuesIndex}>
                  <Configure
                    hitsPerPage={5}
                    clickAnalytics
                    aroundRadius={searchVenuePosition.aroundRadius}
                    aroundLatLng={searchVenuePosition.aroundLatLng}
                  />
                  <AutocompleteVenue />
                </Index>
              </FeatureFlag>
            </StyledScrollView>
          ) : (
            <BodySearch view={params?.view} />
          )}
        </InstantSearch>
      </Form.Flex>
    </React.Fragment>
  )
}

const StyledScrollView = styled.ScrollView({
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
})
