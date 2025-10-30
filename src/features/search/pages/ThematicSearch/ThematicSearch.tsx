import { useIsFocused, useRoute } from '@react-navigation/native'
import React, { ReactNode, useEffect, useMemo } from 'react'
import { Platform, ViewToken } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { convertAlgoliaVenue2AlgoliaVenueOfferListItem } from 'features/search/helpers/searchList/getReconciledVenues'
import { BookPlaylists } from 'features/search/pages/ThematicSearch/Book/BookPlaylists'
import { CinemaPlaylists } from 'features/search/pages/ThematicSearch/Cinema/CinemaPlaylists'
import { ConcertsAndFestivalsPlaylists } from 'features/search/pages/ThematicSearch/ConcertsAndFestivals/ConcertsAndFestivalsPlaylists'
import { FilmsPlaylists } from 'features/search/pages/ThematicSearch/Films/FilmsPlaylists'
import { MusicPlaylists } from 'features/search/pages/ThematicSearch/Music/MusicPlaylists'
import { ThematicSearchBar } from 'features/search/pages/ThematicSearch/ThematicSearchBar'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'
import { Page } from 'ui/pages/Page'
import { Spacer } from 'ui/theme'

const titles = PLACEHOLDER_DATA.searchGroups.reduce((previousValue, currentValue) => {
  return { ...previousValue, [currentValue.name]: currentValue.value }
}, {}) as Record<SearchGroupNameEnumv2, string>

export const ThematicSearch: React.FC = () => {
  const { params, name: currentView } = useRoute<UseRouteType<SearchStackRouteName>>()

  const isWeb = Platform.OS === 'web'
  const { disabilities } = useAccessibilityFiltersContext()
  const { selectedLocationMode } = useLocation()
  const searchIdGenerated = uuidv4()

  const {
    hits: { venues },
    venuesUserData,
  } = useSearchResults()

  const { searchState, dispatch } = useSearch()
  const isFocused = useIsFocused()

  const pageTracking = usePageTracking({
    pageName: 'ThematicSearch',
    pageLocation: 'thematicsearch',
  })

  // Handler for modules with the new system
  const handleTrackViewableItems = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      searchId: string,
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        playlistIndex,
        searchId,
      })
    },
    [pageTracking]
  )

  const shouldDisplayVenuesPlaylist = !searchState.venue && !!venues?.length

  const isLocated = useMemo(
    () => selectedLocationMode !== LocationMode.EVERYWHERE,
    [selectedLocationMode]
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

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories[0]

  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0

  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )

  const handleVenuePlaylistViewableItemsChanged = React.useCallback(
    (items: Pick<ViewToken, 'key' | 'index'>[]) => {
      if (!isFocused) return
      handleTrackViewableItems(
        items,
        venuePlaylistTitle,
        'venue',
        params?.searchId ?? searchIdGenerated,
        0
      )
    },
    [handleTrackViewableItems, isFocused, params?.searchId, searchIdGenerated, venuePlaylistTitle]
  )

  const handleOfferPlaylistViewableItemsChanged = React.useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      playlistIndex?: number
    ) => {
      if (!isFocused) return
      handleTrackViewableItems(
        items,
        moduleId,
        itemType,
        params?.searchId ?? searchIdGenerated,
        playlistIndex
      )
    },
    [handleTrackViewableItems, isFocused, params?.searchId, searchIdGenerated]
  )

  if (!offerCategory) return null

  const playlistsComponent: Partial<Record<SearchGroupNameEnumv2, ReactNode>> = {
    [SearchGroupNameEnumv2.LIVRES]: (
      <BookPlaylists
        shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
        onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}
      />
    ),
    [SearchGroupNameEnumv2.CINEMA]: (
      <CinemaPlaylists
        shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
        onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}
      />
    ),
    [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: (
      <FilmsPlaylists
        shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
        onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}
      />
    ),
    [SearchGroupNameEnumv2.MUSIQUE]: (
      <MusicPlaylists
        shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
        onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}
      />
    ),
    [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: (
      <ConcertsAndFestivalsPlaylists
        shouldDisplayVenuesPlaylist={shouldDisplayVenuesPlaylist}
        onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged}
      />
    ),
  }

  const searchGroupWithGtlPlaylist = getShouldDisplayGtlPlaylist({
    searchGroup: offerCategory,
  })
    ? offerCategory
    : undefined

  return (
    <Page>
      <ThematicSearchBar
        offerCategories={offerCategories}
        placeholder={`${titles[offerCategory]}...`}
        title={titles[offerCategory]}>
        <IntersectionObserverScrollView>
          <SubcategoryButtonListWrapper offerCategory={offerCategory} />
          {shouldDisplayVenuesPlaylist ? (
            <ObservedPlaylist onViewableItemsChanged={handleVenuePlaylistViewableItemsChanged}>
              {({ listRef, handleViewableItemsChanged }) => (
                <VenuePlaylist
                  venuePlaylistTitle={venuePlaylistTitle}
                  venues={venues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)}
                  isLocated={isLocated}
                  currentView={currentView}
                  offerCategory={offerCategory}
                  shouldDisplaySeparator={false}
                  searchGroup={searchGroupWithGtlPlaylist}
                  playlistRef={listRef}
                  onViewableItemsChanged={handleViewableItemsChanged}
                />
              )}
            </ObservedPlaylist>
          ) : null}
          {playlistsComponent[offerCategory]}
          <Spacer.TabBar />
        </IntersectionObserverScrollView>
      </ThematicSearchBar>
    </Page>
  )
}
