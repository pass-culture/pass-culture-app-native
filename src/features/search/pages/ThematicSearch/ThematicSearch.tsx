import { useRoute } from '@react-navigation/native'
import React, { ReactNode, useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { BookPlaylists } from 'features/search/pages/ThematicSearch/Book/BookPlaylists'
import { CinemaPlaylists } from 'features/search/pages/ThematicSearch/Cinema/CinemaPlaylists'
import { ConcertsAndFestivalsPlaylists } from 'features/search/pages/ThematicSearch/ConcertsAndFestivals/ConcertsAndFestivalsPlaylists'
import { FilmsPlaylists } from 'features/search/pages/ThematicSearch/Films/FilmsPlaylists'
import { MusicPlaylists } from 'features/search/pages/ThematicSearch/Music/MusicPlaylists'
import { ThematicSearchBar } from 'features/search/pages/ThematicSearch/ThematicSearchBar'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'
import { Page } from 'ui/pages/Page'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const titles = PLACEHOLDER_DATA.searchGroups.reduce((previousValue, currentValue) => {
  return { ...previousValue, [currentValue.name]: currentValue.value }
}, {}) as Record<SearchGroupNameEnumv2, string>

export const ThematicSearch: React.FC = () => {
  const { tabBarHeight } = useCustomSafeInsets()

  const { params, name: currentView } = useRoute<UseRouteType<SearchStackRouteName>>()

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

  if (!offerCategory) return null

  const playlistsComponent: Partial<Record<SearchGroupNameEnumv2, ReactNode>> = {
    [SearchGroupNameEnumv2.LIVRES]: <BookPlaylists />,
    [SearchGroupNameEnumv2.CINEMA]: <CinemaPlaylists />,
    [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: <FilmsPlaylists />,
    [SearchGroupNameEnumv2.MUSIQUE]: <MusicPlaylists />,
    [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: <ConcertsAndFestivalsPlaylists />,
  }

  const shouldDisplayAccessibilityContent =
    Object.values(disabilities).filter((disability) => disability).length > 0

  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )

  const searchGroupWithGtlPlaylist = getShouldDisplayGtlPlaylist({
    searchGroup: offerCategory,
  })
    ? offerCategory
    : undefined

  return (
    <StyledPage tabBarHeight={tabBarHeight}>
      <ThematicSearchBar
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
              shouldDisplaySeparator={false}
              searchGroup={searchGroupWithGtlPlaylist}
            />
          ) : null}
          {playlistsComponent[offerCategory]}
        </ScrollView>
      </ThematicSearchBar>
    </StyledPage>
  )
}

const StyledPage = styled(Page)<{ tabBarHeight: number }>(({ theme, tabBarHeight }) => ({
  marginBottom: theme.isDesktopViewport
    ? theme.contentPage.marginVertical
    : tabBarHeight + theme.contentPage.marginVertical,
}))
