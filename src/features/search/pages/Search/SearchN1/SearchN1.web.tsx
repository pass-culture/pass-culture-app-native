import { useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1/SearchN1Bar'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { env } from 'libs/environment'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'
import { Spacer } from 'ui/theme'

const titles = PLACEHOLDER_DATA.searchGroups.reduce((previousValue, currentValue) => {
  return { ...previousValue, [currentValue.name]: currentValue.value }
}, {}) as Record<SearchGroupNameEnumv2, string>

export const SearchN1: React.FC = () => {
  const { params, name: currentView } = useRoute<UseRouteType<SearchStackRouteName>>()
  const isReplicaAlgoliaIndexActive = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_REPLICA_ALGOLIA_INDEX
  )
  const { gtlPlaylists, isLoading: arePlaylistsLoading } = useGTLPlaylists({
    queryKey: 'SEARCH_N1_BOOKS_GTL_PLAYLISTS',
    searchIndex: isReplicaAlgoliaIndexActive
      ? env.ALGOLIA_OFFERS_INDEX_NAME_B
      : env.ALGOLIA_OFFERS_INDEX_NAME,
  })

  const { selectedLocationMode } = useLocation()

  const {
    hits: { venues },
  } = useSearchResults()

  const { searchState, dispatch } = useSearch()

  const shouldDisplayVenuesPlaylist = !searchState.venue && !!venues?.length

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
  )

  useEffect(() => {
    if (params?.offerCategories) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          offerCategories: params.offerCategories,
        },
      })
    }
  }, [dispatch, params?.offerCategories, searchState])

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories?.[0] || SearchGroupNameEnumv2.LIVRES
  const isBookCategory = offerCategory === SearchGroupNameEnumv2.LIVRES

  const getVenuePlaylistTitle = () => {
    if (isLocated) {
      switch (offerCategory) {
        case SearchGroupNameEnumv2.LIVRES:
          return 'Les librairies près de toi'
        case SearchGroupNameEnumv2.CINEMA:
          return 'Les cinémas près de toi'
        case SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES:
          return 'Les lieux culturels près de toi'
        default:
          return 'Les lieux culturels'
      }
    }
    return 'Les lieux culturels'
  }

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <SearchN1Bar
      offerCategories={offerCategories}
      placeholder={`${titles[offerCategory]}...`}
      title={titles[offerCategory]}>
      <ScrollView>
        <SubcategoryButtonListWrapper offerCategory={offerCategory} />
        {shouldDisplayVenuesPlaylist ? (
          <VenuePlaylist
            venuePlaylistTitle={getVenuePlaylistTitle()}
            venues={venues}
            isLocated={isLocated}
            currentView={currentView}
          />
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
        {isBookCategory && gtlPlaylists.length > 0 ? (
          <React.Fragment>
            {gtlPlaylists.map((playlist) => (
              <GtlPlaylist
                key={playlist.entryId}
                playlist={playlist}
                analyticsFrom="searchn1"
                route="SearchN1"
              />
            ))}
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
      </ScrollView>
    </SearchN1Bar>
  )
}
