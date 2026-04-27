import { useIsFocused } from '@react-navigation/native'
import { FlashList, FlashListRef } from '@shopify/flash-list'
import { SearchResponse } from 'algoliasearch'
import React, { FC, useEffect, useState } from 'react'
import { Platform, ViewToken, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { usePreviousRouteName } from 'features/navigation/helpers/usePreviousRouteName'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { NoSearchResult } from 'features/search/components/NoSearchResult/NoSearchResult'
import { ArtistSection } from 'features/search/components/SearchListHeader/ArtistSection'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { convertAlgoliaVenue2AlgoliaVenueOfferListItem } from 'features/search/helpers/searchList/getReconciledVenues'
import { useNavigateToSearchFilter } from 'features/search/helpers/useNavigateToSearchFilter/useNavigateToSearchFilter'
import { SearchArtistItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchArtistItemWrapper'
import { SearchOfferItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchOfferItemWrapper'
import { SearchResultsListHeader } from 'features/search/pages/SearchResults/v2/components/SearchResultsListHeader'
import { SearchResultsPlaceHolder } from 'features/search/pages/SearchResults/v2/components/SearchResultsPlaceholder'
import { SearchVenueItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchVenueItemWrapper'
import { VenueSection } from 'features/search/pages/SearchResults/v2/components/VenueSection'
import { getHelmetTitle } from 'features/search/pages/SearchResults/v2/utils'
import { SelectSearchOffersParams } from 'features/search/queries/useSearchOffersQuery/types'
import { useGridListLayout } from 'features/search/store/gridListLayoutStore'
import {
  GridListLayout,
  SearchListContent,
  SearchListProps,
  SearchResultItem,
  SearchView,
  VenuesUserData,
} from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location/LocationWrapper'
import { Offer } from 'shared/offer/types'
import { useViewableItemsTracker } from 'shared/tracking/useViewableItemsTracker'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

type Props = {
  venuesUserData: VenuesUserData
  onViewableItemsChanged?: SearchListProps['onViewableVenuePlaylistItemsChanged']
  isLoading: boolean
  isFetching: boolean
  isRefetching: boolean
  isSuccess: boolean
  onEndReached: () => void
  onSearchResultsRefresh: () => void
  userData: SearchResponse<Offer[]>['userData']
  onPressAIFakeDoorBanner: () => void
  enableAIFakeDoor?: boolean
  searchListContent: SearchListContent
  disabilities: DisabilitiesProperties
  selectedFilter: SelectSearchOffersParams['selectedFilter']
}

const ANIMATION_DURATION = 700
const isWeb = Platform.OS === 'web'

const keyExtractor = (item: SearchResultItem) => {
  switch (item.type) {
    case 'offer':
    case 'venue':
      return item.data.objectID
    case 'artist':
      return item.data.id
    default:
      return uuidv4()
  }
}
export const SearchResultsContent: FC<Props> = ({
  venuesUserData,
  onViewableItemsChanged,
  isLoading,
  isFetching,
  isRefetching,
  isSuccess,
  onEndReached,
  onSearchResultsRefresh,
  userData,
  enableAIFakeDoor,
  onPressAIFakeDoorBanner,
  searchListContent,
  disabilities,
  selectedFilter,
}) => {
  const {
    hits: { artists, venues },
    title,
    nbHits,
    items,
  } = searchListContent

  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const isFocused = useIsFocused()

  const previousRouteName = usePreviousRouteName()

  const { listRef: searchListRef, handleViewableItemsChanged } = useViewableItemsTracker<
    FlashListRef<SearchResultItem>
  >({
    onViewableItemsChanged: (items: Pick<ViewToken, 'key' | 'index'>[]) =>
      onViewableItemsChanged?.(
        items,
        'searchResults',
        'offer',
        venuesUserData === undefined ? 0 : 1
      ),
  })
  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition()

  const shouldRenderScrollToTopButton = nbHits > 0 && !isWeb

  const { searchState } = useSearch()
  const { setSelectedLocationMode, setPlace } = useLocation()
  const { navigateToSearchFilter } = useNavigateToSearchFilter()

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isRefetching, ANIMATION_DURATION)

  const { width } = useWindowDimensions()
  const { designSystem, breakpoints, tabBar } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  const isOffersContent = selectedFilter === 'Offres' || !selectedFilter
  const isVenuesContent = selectedFilter === 'Lieux'

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const gridListLayout = useGridListLayout()
  const shouldDisplayGridList = enableGridList && !isWeb && isOffersContent
  const isGridLayout = shouldDisplayGridList && gridListLayout === GridListLayout.GRID

  useEffect(() => {
    if (isSuccess && !isFetching) {
      void analytics.logPerformSearch(
        searchState,
        disabilities,
        nbHits,
        previousRouteName === SearchView.Thematic ? previousRouteName : SearchView.Results
      )

      if (!nbHits) {
        void analytics.logNoSearchResult(searchState.query, searchState.searchId)
      }
    }
  }, [disabilities, isFetching, isSuccess, nbHits, previousRouteName, searchState])

  const shouldDisplayVenueSection =
    !selectedFilter && !searchState.venue && previousRouteName !== SearchView.Thematic

  const shouldDisplayArtistSection = !selectedFilter && artists?.length

  const totalHitsToDisplay = items.length + artists.length + venues.length

  if (!totalHitsToDisplay || (selectedFilter && !items.length)) {
    return (
      <NoSearchResult
        setSelectedLocationMode={setSelectedLocationMode}
        searchState={searchState}
        setPlace={setPlace}
        navigateToSearchFilter={navigateToSearchFilter}
      />
    )
  }

  if (showSkeleton) return <SearchResultsPlaceHolder />

  return (
    <React.Fragment>
      {isFocused ? <Helmet title={getHelmetTitle(searchState.query, nbHits)} /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <Container testID="searchResults">
        <FlashList
          ref={searchListRef}
          key={`${isGridLayout ? 'grid_search_results' : 'list_search_results'}_${selectedFilter || 'all'}`}
          testID="searchResultsFlashlist"
          data={items}
          keyExtractor={keyExtractor}
          getItemType={(item: SearchResultItem) => item.type}
          ListHeaderComponent={
            <SearchResultsListHeader
              nbHits={nbHits}
              title={title}
              userData={userData}
              venuesSection={
                shouldDisplayVenueSection ? (
                  <VenueSection
                    venues={venues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)}
                    onViewableVenuePlaylistItemsChanged={onViewableItemsChanged}
                    withMargins={false}
                  />
                ) : undefined
              }
              artistSection={
                shouldDisplayArtistSection ? (
                  <StyledArtistSection
                    artists={artists}
                    searchId={searchState.searchId}
                    withMargins={false}
                  />
                ) : undefined
              }
              shouldDisplayGridList={shouldDisplayGridList}
              enableAIFakeDoor={enableAIFakeDoor}
              onPressAIFakeDoorBanner={onPressAIFakeDoorBanner}
            />
          }
          ItemSeparatorComponent={isGridLayout || isVenuesContent ? undefined : LineSeparator}
          renderItem={renderItem}
          numColumns={isGridLayout || isVenuesContent ? nbrOfTilesToDisplay : undefined}
          refreshing={isRefreshing}
          onRefresh={onSearchResultsRefresh}
          onEndReached={autoScrollEnabled ? onEndReached : undefined}
          scrollEnabled={nbHits > 0}
          onScroll={onScroll}
          contentContainerStyle={{
            paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
            paddingHorizontal: designSystem.size.spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      </Container>
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
    </React.Fragment>
  )
}

const renderItem = ({ item, index }) => {
  if (item.type === 'artist') return <SearchArtistItemWrapper item={item} />

  if (item.type === 'venue') return <SearchVenueItemWrapper item={item} index={index} />

  return <SearchOfferItemWrapper item={item} index={index} />
}

const Container = styled.View({
  flex: 1,
})

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

const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))
