import { useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import { Platform, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

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
import { CinemaPlaylist } from 'features/search/pages/ThematicSearch/Cinema/CinemaPlaylist'
import { FilmsPlaylist } from 'features/search/pages/ThematicSearch/Films/FilmsPlaylist'
import { MusicPlaylist } from 'features/search/pages/ThematicSearch/Music/MusicPlaylist'
import { ThematicSearchBar } from 'features/search/pages/ThematicSearch/ThematicSearchBar'
import { ThematicSearchSkeleton } from 'features/search/pages/ThematicSearch/ThematicSearchSkeleton'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'
import { getSpacing, Spacer } from 'ui/theme'

const titles = PLACEHOLDER_DATA.searchGroups.reduce((previousValue, currentValue) => {
  return { ...previousValue, [currentValue.name]: currentValue.value }
}, {}) as Record<SearchGroupNameEnumv2, string>

export const ThematicSearch: React.FC = () => {
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
  const isWeb = Platform.OS === 'web'
  const { disabilities } = useAccessibilityFiltersContext()
  const { selectedLocationMode } = useLocation()

  const {
    hits: { venues },
    venuesUserData,
  } = useSearchResults()

  const { searchState, dispatch } = useSearch()

  const shouldDisplayVenuesPlaylist = !searchState.venue && !!venues?.length

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
  )

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories?.[0] || SearchGroupNameEnumv2.LIVRES
  const isBookCategory = offerCategory === SearchGroupNameEnumv2.LIVRES
  const isCinemaCategory = offerCategory === SearchGroupNameEnumv2.CINEMA
  const isFilmsCategory = offerCategory === SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES
  const isMusicCategory = offerCategory === SearchGroupNameEnumv2.MUSIQUE

  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0

  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )
  useEffect(() => {
    if (params?.offerCategories && isWeb) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          offerCategories: params.offerCategories,
        },
      })
    }
    // adding searchstate in deps would result in an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isWeb, params?.offerCategories])

  return (
    <ThematicSearchBar
      offerCategories={offerCategories}
      placeholder={`${titles[offerCategory]}...`}
      title={titles[offerCategory]}>
      {arePlaylistsLoading ? (
        <ThematicSearchSkeleton />
      ) : (
        <ScrollView>
          <SubcategoryButtonListWrapper offerCategory={offerCategory} />
          {shouldDisplayVenuesPlaylist ? (
            <VenuePlaylist
              venuePlaylistTitle={venuePlaylistTitle}
              venues={venues}
              isLocated={isLocated}
              currentView={currentView}
              offerCategory={offerCategory}
              shouldDisplaySeparator={false}
            />
          ) : null}
          <PlaylistContainer>
            {isBookCategory && gtlPlaylists.length > 0 ? (
              <GtlPlaylistContainer>
                {gtlPlaylists.map((playlist) => (
                  <GtlPlaylist
                    key={playlist.entryId}
                    playlist={playlist}
                    analyticsFrom="thematicsearch"
                    route="ThematicSearch"
                  />
                ))}
                <Spacer.Column numberOfSpaces={6} />
              </GtlPlaylistContainer>
            ) : null}
            {isCinemaCategory ? <CinemaPlaylist /> : null}
            {isFilmsCategory ? <FilmsPlaylist /> : null}
            {isMusicCategory ? <MusicPlaylist /> : null}
          </PlaylistContainer>
        </ScrollView>
      )}
    </ThematicSearchBar>
  )
}

const GtlPlaylistContainer = styled(View)({ paddingBottom: getSpacing(6) })
const PlaylistContainer = styled(View)({ paddingTop: getSpacing(6) })
