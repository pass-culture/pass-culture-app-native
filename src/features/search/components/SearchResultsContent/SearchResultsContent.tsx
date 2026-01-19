import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { FlashListRef } from '@shopify/flash-list'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Platform, useWindowDimensions, ViewToken } from 'react-native'
import styled from 'styled-components/native'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { PlaylistType } from 'features/offer/enums'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { NoSearchResult } from 'features/search/components/NoSearchResult/NoSearchResult'
import { SearchList } from 'features/search/components/SearchList/SearchList'
import { ArtistSection } from 'features/search/components/SearchListHeader/ArtistSection'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { getStringifySearchStateWithoutLocation } from 'features/search/helpers/getStringifySearchStateWithoutLocation/getStringifySearchStateWithoutLocation'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useNavigateToSearchFilter } from 'features/search/helpers/useNavigateToSearchFilter/useNavigateToSearchFilter'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { GridListLayout, VenuesUserData } from 'features/search/types'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { getRegionFromPosition } from 'features/venueMap/helpers/getRegionFromPosition/getRegionFromPosition'
import { isGeolocValid } from 'features/venueMap/helpers/isGeolocValid'
import {
  removeSelectedVenue,
  setInitialRegion,
  setOffersPlaylistType,
  setRegion,
  setVenues,
  useVenueMapStore,
} from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { plural } from 'libs/plural'
import { Offer } from 'shared/offer/types'
import { useViewableItemsTracker } from 'shared/tracking/useViewableItemsTracker'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import {
  HeaderSearchResultsPlaceholder,
  HitPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Grid } from 'ui/svg/icons/Grid'
import { List } from 'ui/svg/icons/List'
import { Map } from 'ui/svg/icons/Map'
import { RATIO_HOME_IMAGE, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

const ANIMATION_DURATION = 700

enum Tab {
  SEARCHLIST = 'Résultats',
  MAP = 'Carte',
}

const isWeb = Platform.OS === 'web'

export type SearchResultsContentProps = {
  onEndReached: () => void
  onSearchResultsRefresh: () => void
  hits: SearchOfferHits
  nbHits: number
  isLoading?: boolean
  isFetching?: boolean
  isFetchingNextPage?: boolean
  userData: unknown
  venuesUserData: VenuesUserData
  offerVenues: Venue[]
  onViewableItemsChanged?: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
}

export const SearchResultsContent: React.FC<SearchResultsContentProps> = ({
  onEndReached,
  onSearchResultsRefresh,
  onViewableItemsChanged,
  hits,
  nbHits,
  isLoading,
  isFetching,
  isFetchingNextPage,
  userData,
  venuesUserData,
  offerVenues,
}) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const { listRef: searchListRef, handleViewableItemsChanged } = useViewableItemsTracker<
    FlashListRef<Offer>
  >({
    onViewableItemsChanged: (items: Pick<ViewToken, 'key' | 'index'>[]) =>
      onViewableItemsChanged?.(
        items,
        'searchResults',
        'offer',
        venuesUserData === undefined ? 0 : 1
      ),
  })

  const { disabilities } = useAccessibilityFiltersContext()
  const { searchState } = useSearch()
  const { navigateToSearchFilter } = useNavigateToSearchFilter()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')

  const showSkeleton = useIsFalseWithDelay(!!isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(!!isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()
  const { geolocPosition, selectedLocationMode, selectedPlace, onResetPlace } = useLocation()
  const { width, height } = useWindowDimensions()
  const shouldDisplayVenueMapInSearch = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH
  )

  const gridListLayout = useGridListLayout()

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const shouldDisplayGridList = enableGridList && !isWeb
  const isGridLayout = shouldDisplayGridList && gridListLayout === GridListLayout.GRID

  const [isSearchListTab, setIsSearchListTab] = useState(true)
  const [defaultTab, setDefaultTab] = useState(Tab.SEARCHLIST)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)

  const initialRegion = useVenueMapStore((state) => state.initialRegion)

  // Initial copy of location filters
  const stringifySearchStateWithoutLocation = useRef(
    getStringifySearchStateWithoutLocation(searchState)
  )

  useFocusEffect(
    useCallback(() => {
      const location = selectedPlace?.geolocation ?? geolocPosition
      if (!location) {
        return
      }
      const region = getRegionFromPosition(location, width / height)
      if (!initialRegion) {
        setInitialRegion(region)
      }
      setRegion(region)
    }, [geolocPosition, selectedPlace, width, height, initialRegion])
  )

  useFocusEffect(
    useCallback(() => {
      const playlistType =
        hits.venues && hits.venues.length > 0
          ? PlaylistType.TOP_OFFERS
          : PlaylistType.SEARCH_RESULTS
      setOffersPlaylistType(playlistType)
    }, [hits.venues])
  )

  useFocusEffect(
    useCallback(() => {
      const geolocatedVenues = offerVenues?.filter(
        (venue): venue is GeolocatedVenue => !!(venue.venueId && isGeolocValid(venue._geoloc))
      )
      if (geolocatedVenues) {
        setVenues(geolocatedVenues)
      }
    }, [offerVenues])
  )

  // Execute log only on initial search fetch
  const previousIsLoading = usePrevious(isLoading)
  useEffect(() => {
    if (previousIsLoading && !isLoading) {
      void analytics.logPerformSearch(searchState, disabilities, nbHits, 'SearchResults')
      if (nbHits === 0) {
        void analytics.logNoSearchResult(searchState.query, searchState.searchId)
      }
    }
  }, [isLoading, nbHits, previousIsLoading, searchState, disabilities])

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition()

  const {
    visible: venueMapLocationModalVisible,
    showModal: showVenueMapLocationModal,
    hideModal: hideVenueMapLocationModal,
  } = useModal(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    // Despite the fact that the useEffect hook being called immediately,
    // scrollToOffset may not always have an effect for unknown reason,
    // debouncing scrollToOffset solves it.
    debounce(
      useCallback(() => {
        if (searchListRef?.current) {
          searchListRef.current.scrollToOffset({ offset: 0, animated: true })
        }
      }, [searchListRef])
    ),
    [nbHits, searchState]
  )

  useEffect(() => {
    if (selectedLocationMode === LocationMode.EVERYWHERE) {
      setDefaultTab(Tab.SEARCHLIST)
    }
  }, [selectedLocationMode])

  useEffect(() => {
    if (selectedLocationMode === LocationMode.EVERYWHERE && !venueMapLocationModalVisible) {
      setDefaultTab(Tab.SEARCHLIST)
    }
  }, [selectedLocationMode, venueMapLocationModalVisible])

  // This useEffect monitors changes to `searchState`. When `searchState` is updated, it
  // generates a string representation of the filters excluding location data. If the new
  // filter string differs from the previously stored value, it resets the default tab to
  // `Tab.SEARCHLIST` and updates the stored filter string. This ensures that the UI
  // responds correctly to filter changes while ignoring location information.
  useEffect(() => {
    const currentFiltersWithoutLocation = getStringifySearchStateWithoutLocation(searchState)

    if (currentFiltersWithoutLocation !== stringifySearchStateWithoutLocation.current) {
      setDefaultTab(Tab.SEARCHLIST)
      stringifySearchStateWithoutLocation.current = currentFiltersWithoutLocation
    }
  }, [searchState])

  const { tileWidth, nbrOfTilesToDisplay } = getGridTileRatio(width)

  const renderItem = useCallback<
    ({ item, index }: { item: Offer; index: number }) => React.JSX.Element
  >(
    ({ item, index }) =>
      isGridLayout ? (
        <OfferTileWrapper
          item={item}
          analyticsFrom="searchresults"
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          containerWidth={width / nbrOfTilesToDisplay}
          searchId={searchState.searchId}
        />
      ) : (
        <StyledHorizontalOfferTile
          offer={item}
          analyticsParams={{
            query: searchState.query,
            index,
            searchId: searchState.searchId,
            from: 'searchresults',
          }}
        />
      ),
    [isGridLayout, tileWidth, width, nbrOfTilesToDisplay, searchState.searchId, searchState.query]
  )

  const triggerMapTab = () => {
    removeSelectedVenue()
    setDefaultTab(Tab.MAP)
    if (selectedLocationMode === LocationMode.EVERYWHERE) {
      showVenueMapLocationModal()
      return
    }

    void analytics.logConsultVenueMap({
      from: 'search',
      searchId: searchState.searchId,
    })
    setIsSearchListTab(false)
  }

  const dismissVenueMapLocationModal = () => {
    if (
      selectedLocationMode === LocationMode.EVERYWHERE &&
      tempLocationMode === LocationMode.EVERYWHERE
    ) {
      setDefaultTab(Tab.SEARCHLIST)
    }

    hideVenueMapLocationModal()
  }

  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      searchId: searchState.searchId,
      from: 'search',
    })
  }

  if (showSkeleton) return <SearchResultsPlaceHolder />

  const numberOfResults =
    nbHits > 0
      ? plural(nbHits, {
          singular: '# résultat',
          plural: '# résultats',
        })
      : 'Pas de résultat'
  const searchStateQuery = searchState.query.length > 0 ? ` pour ${searchState.query}` : ''
  const helmetTitle = numberOfResults + searchStateQuery + ' | Recherche | pass Culture'

  // We don't want to render it on the web, even if it's not plugged in, since it avoids the user
  // to press on a working button
  const shouldRenderScrollToTopButton =
    nbHits > 0 &&
    Platform.OS !== 'web' &&
    (!shouldDisplayVenueMapInSearch || (shouldDisplayVenueMapInSearch && isSearchListTab))

  const tabPanels = {
    [Tab.SEARCHLIST]: (
      <SearchList
        ref={searchListRef}
        isFetchingNextPage={!!isFetchingNextPage}
        hits={hits}
        nbHits={nbHits}
        renderItem={renderItem}
        numColumns={nbrOfTilesToDisplay}
        autoScrollEnabled={autoScrollEnabled}
        onEndReached={onEndReached}
        onScroll={onScroll}
        refreshing={isRefreshing}
        onRefresh={onSearchResultsRefresh}
        onPress={onEndReached}
        userData={userData}
        venuesUserData={venuesUserData}
        artistSection={
          hits.artists.length ? (
            <StyledArtistSection
              artists={hits.artists}
              onItemPress={handleOnArtistPlaylistItemPress}
            />
          ) : undefined
        }
        isGridLayout={isGridLayout}
        shouldDisplayGridList={shouldDisplayGridList}
        onViewableItemsChanged={handleViewableItemsChanged}
        onViewableVenuePlaylistItemsChanged={onViewableItemsChanged}
      />
    ),
    [Tab.MAP]: selectedLocationMode === LocationMode.EVERYWHERE ? null : <VenueMapViewContainer />,
  }

  const shouldDisplayTabLayout = shouldDisplayVenueMapInSearch && !isWeb

  const renderSearchList = () => {
    if (nbHits > 0) {
      return shouldDisplayTabLayout ? (
        <TabLayout
          tabPanels={tabPanels}
          defaultTab={defaultTab}
          tabs={[
            { key: Tab.SEARCHLIST, Icon: isGridLayout ? Grid : List },
            { key: Tab.MAP, Icon: Map },
          ]}
          onTabChange={{
            Carte: triggerMapTab,
            Résultats: () => setIsSearchListTab(true),
          }}
        />
      ) : (
        tabPanels[Tab.SEARCHLIST]
      )
    }

    return (
      <NoSearchResult
        searchState={searchState}
        navigateToSearchFilter={navigateToSearchFilter}
        onResetPlace={onResetPlace}
        navigateToSearchResults={navigateToSearchResults}
      />
    )
  }

  return (
    <React.Fragment>
      {isFocused ? <Helmet title={helmetTitle} /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <Container testID="searchResults">{renderSearchList()}</Container>
      {shouldRenderScrollToTopButton ? (
        <ScrollToTopContainer>
          <ScrollToTopButton
            transition={scrollButtonTransition}
            onPress={() => {
              searchListRef.current?.scrollToOffset({ offset: 0 })
            }}
          />
          <Spacer.BottomScreen />
        </ScrollToTopContainer>
      ) : null}
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={dismissVenueMapLocationModal}
        setTempLocationMode={setTempLocationMode}
        openedFrom="search"
        shouldOpenMapInTab
      />
    </React.Fragment>
  )
}

const contentContainerStyle = {
  flexGrow: 1,
}

const Container = styled.View({
  flex: 1,
})

const SkeletonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + theme.designSystem.size.spacing.xxxl,
  alignItems: 'center',
}))

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const ScrollToTopContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: theme.designSystem.size.spacing.xl,
  bottom: theme.tabBar.height + theme.designSystem.size.spacing.xl,
  zIndex: theme.zIndex.floatingButton,
}))

const StyledArtistSection = styled(ArtistSection)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

const SearchResultsPlaceHolder = () => {
  const renderItem = useCallback(
    () => (
      <SkeletonContainer>
        <HitPlaceholder />
      </SkeletonContainer>
    ),
    []
  )

  return (
    <Container>
      <FlatList
        data={FAVORITE_LIST_PLACEHOLDER}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={<HeaderSearchResultsPlaceholder />}
        ListFooterComponent={<Footer />}
        scrollEnabled={false}
      />
    </Container>
  )
}
