import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
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
  const { disabilities } = useAccessibilityFiltersContext()
  const { selectedLocationMode } = useLocation()

  const {
    hits: { venues },
    venuesUserData,
  } = useSearchResults()

  const { searchState } = useSearch()

  const shouldDisplayVenuesPlaylist = !searchState.venue && !!venues?.length

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
  )

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories?.[0] || SearchGroupNameEnumv2.LIVRES
  const isBookCategory = offerCategory === SearchGroupNameEnumv2.LIVRES

  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0

  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )

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
            venuePlaylistTitle={venuePlaylistTitle}
            venues={venues}
            isLocated={isLocated}
            currentView={currentView}
            offerCategory={offerCategory}
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
