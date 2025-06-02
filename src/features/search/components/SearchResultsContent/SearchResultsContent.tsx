import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, useWindowDimensions, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityFiltersModal } from 'features/accessibility/components/AccessibilityFiltersModal'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { PlaylistType } from 'features/offer/enums'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchList } from 'features/search/components/SearchList/SearchList'
import { ArtistSection } from 'features/search/components/SearchListHeader/ArtistSection'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { getStringifySearchStateWithoutLocation } from 'features/search/helpers/getStringifySearchStateWithoutLocation/getStringifySearchStateWithoutLocation'
import {
  FILTER_TYPES,
  useAppliedFilters,
} from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { useFilterCount } from 'features/search/helpers/useFilterCount/useFilterCount'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useNavigateToSearchFilter } from 'features/search/helpers/useNavigateToSearchFilter/useNavigateToSearchFilter'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { CalendarModal } from 'features/search/pages/modals/CalendarModal/CalendarModal'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DatesHoursModal } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { PriceModal } from 'features/search/pages/modals/PriceModal/PriceModal'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { VenuesUserData } from 'features/search/types'
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
import { FacetData } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { plural } from 'libs/plural'
import { Offer } from 'shared/offer/types'
import { ellipseString } from 'shared/string/ellipseString'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { FilterButtonList, FilterButtonListItem } from 'ui/components/FilterButtonList'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import {
  HeaderSearchResultsPlaceholder,
  HitPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Map } from 'ui/svg/icons/Map'
import { Sort } from 'ui/svg/icons/Sort'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

const ANIMATION_DURATION = 700
const MAX_VENUE_CHARACTERS = 20

enum Tab {
  SEARCHLIST = 'Liste',
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
  facets: FacetData
  offerVenues: Venue[]
}

export const SearchResultsContent: React.FC<SearchResultsContentProps> = ({
  onEndReached,
  onSearchResultsRefresh,
  hits,
  nbHits,
  isLoading,
  isFetching,
  isFetchingNextPage,
  userData,
  venuesUserData,
  facets,
  offerVenues,
}) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const searchListRef = useRef<FlashList<Offer> | null>(null)

  const { disabilities } = useAccessibilityFiltersContext()
  const { searchState } = useSearch()
  const { navigateToSearchFilter } = useNavigateToSearchFilter()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')

  const showSkeleton = useIsFalseWithDelay(!!isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(!!isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()
  const { user } = useAuthContext()
  const { geolocPosition, selectedLocationMode, selectedPlace, onResetPlace } = useLocation()
  const { width, height } = useWindowDimensions()
  const shouldDisplayVenueMapInSearch = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH
  )
  const shouldDisplayCalendarModal = useFeatureFlag(RemoteStoreFeatureFlags.WIP_TIME_FILTER_V2)

  const [isSearchListTab, setIsSearchListTab] = useState(true)
  const [defaultTab, setDefaultTab] = useState(Tab.SEARCHLIST)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)

  const initialRegion = useVenueMapStore((state) => state.initialRegion)

  const isVenue = !!searchState.venue

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
      analytics.logPerformSearch(searchState, disabilities, nbHits, 'SearchResults')
      if (nbHits === 0) {
        analytics.logNoSearchResult(searchState.query, searchState.searchId)
      }
    }
  }, [isLoading, nbHits, previousIsLoading, searchState, disabilities])

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition()

  const appliedFilters = useAppliedFilters(searchState)
  const {
    visible: categoriesModalVisible,
    showModal: showCategoriesModal,
    hideModal: hideCategoriesModal,
  } = useModal(false)
  const {
    visible: searchPriceModalVisible,
    showModal: showSearchPriceModal,
    hideModal: hideSearchPriceModal,
  } = useModal(false)
  const {
    visible: offerDuoModalVisible,
    showModal: showOfferDuoModal,
    hideModal: hideOfferDuoModal,
  } = useModal(false)
  const {
    visible: venueModalVisible,
    showModal: showVenueModal,
    hideModal: hideVenueModal,
  } = useModal(false)
  const {
    visible: datesHoursModalVisible,
    showModal: showDatesHoursModal,
    hideModal: hideDatesHoursModal,
  } = useModal(false)
  const {
    visible: accesibilityFiltersModalVisible,
    showModal: showAccessibilityModal,
    hideModal: hideAccessibilityModal,
  } = useModal(false)
  const {
    visible: venueMapLocationModalVisible,
    showModal: showVenueMapLocationModal,
    hideModal: hideVenueMapLocationModal,
  } = useModal(false)
  const {
    visible: calendarModalVisible,
    showModal: showCalendarModal,
    hideModal: hideCalendarModal,
  } = useModal(false)

  const activeFiltersCount = useFilterCount(searchState)

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

  const renderItem = useCallback<
    ({ item, index }: { item: Offer; index: number }) => React.JSX.Element
  >(
    ({ item: hit, index }) => (
      <StyledHorizontalOfferTile
        offer={hit}
        analyticsParams={{
          query: searchState.query,
          index,
          searchId: searchState.searchId,
          from: 'searchresults',
        }}
      />
    ),
    [searchState.query, searchState.searchId]
  )

  const hasDuoOfferToggle = useMemo(() => {
    const isBeneficiary = !!user?.isBeneficiary
    const hasRemainingCredit = !!user?.domainsCredit?.all?.remaining

    return isBeneficiary && hasRemainingCredit
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining])

  const triggerMapTab = () => {
    removeSelectedVenue()
    setDefaultTab(Tab.MAP)
    if (selectedLocationMode === LocationMode.EVERYWHERE) {
      showVenueMapLocationModal()
      return
    }

    analytics.logConsultVenueMap({
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

  const handleOnArtistPlaylistItemPress = (artistName: string) => {
    analytics.logConsultArtist({ artistName, from: 'search' })
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
      />
    ),
    [Tab.MAP]: selectedLocationMode === LocationMode.EVERYWHERE ? null : <VenueMapViewContainer />,
  }

  const shouldDisplayTabLayout = shouldDisplayVenueMapInSearch && !isWeb

  const renderTabLayout = () => (
    <TabLayout
      tabPanels={tabPanels}
      defaultTab={defaultTab}
      tabs={[
        { key: Tab.SEARCHLIST, Icon: Sort },
        { key: Tab.MAP, Icon: Map },
      ]}
      onTabChange={{
        Carte: triggerMapTab,
        Liste: () => setIsSearchListTab(true),
      }}
    />
  )

  const renderNoSearchResults = () => {
    const isEverywhereSearch = searchState.locationFilter.locationType === LocationMode.EVERYWHERE

    const noResultsProps = {
      title: 'Pas de résultat',
      subtitle: searchState.query ? `pour "${searchState.query}"` : '',
      errorDescription: searchState.query
        ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
        : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.',
    }

    if (isEverywhereSearch) {
      return (
        <NoSearchResultsWrapper>
          <NoSearchResult
            {...noResultsProps}
            ctaWording="Modifier mes filtres"
            onPress={() => navigateToSearchFilter(searchState)}
          />
        </NoSearchResultsWrapper>
      )
    }

    return (
      <NoSearchResultsWrapper>
        <NoSearchResult
          {...noResultsProps}
          errorDescription="Élargis la zone de recherche pour plus de résultats."
          ctaWording="Élargir la zone de recherche"
          onPress={() => {
            analytics.logExtendSearchRadiusClicked(searchState.searchId)
            onResetPlace()
            navigateToSearchResults({
              ...searchState,
              locationFilter: {
                locationType: LocationMode.EVERYWHERE,
              },
            })
          }}
        />
      </NoSearchResultsWrapper>
    )
  }

  const renderSearchList = () => {
    if (nbHits > 0) {
      return shouldDisplayTabLayout ? renderTabLayout() : tabPanels[Tab.SEARCHLIST]
    }

    return renderNoSearchResults()
  }

  const filterButtonListItems: FilterButtonListItem[] = [
    {
      label: shouldDisplayCalendarModal ? 'Dates' : 'Dates & heures',
      testID: 'datesHoursButton',
      onPress: shouldDisplayCalendarModal ? showCalendarModal : showDatesHoursModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.DATES_HOURS),
    },
    {
      label: searchState.venue
        ? ellipseString(searchState.venue.label, MAX_VENUE_CHARACTERS)
        : 'Lieu culturel',
      testID: 'venueButton',
      onPress: showVenueModal,
      isApplied: isVenue,
    },
    {
      label: 'Catégories',
      testID: 'categoryButton',
      onPress: showCategoriesModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.CATEGORIES),
    },
    {
      label: 'Prix',
      testID: 'priceButton',
      onPress: showSearchPriceModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.PRICES),
    },
    ...(hasDuoOfferToggle
      ? [
          {
            label: 'Duo',
            testID: 'DuoButton',
            onPress: showOfferDuoModal,
            isApplied: appliedFilters.includes(FILTER_TYPES.OFFER_DUO),
          },
        ]
      : []),
    {
      label: 'Accessibilité',
      testID: 'lieuxAccessiblesButton',
      onPress: showAccessibilityModal,
      isApplied: appliedFilters.includes(FILTER_TYPES.ACCESSIBILITY),
    },
  ]

  return (
    <React.Fragment>
      {isFocused ? <Helmet title={helmetTitle} /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <View>
        <FilterButtonList
          items={filterButtonListItems}
          contentContainerStyle={{ marginBottom: getSpacing(2), paddingHorizontal: getSpacing(5) }}>
          <StyledLi>
            <FilterButton
              activeFilters={activeFiltersCount}
              navigateTo={{ screen: 'SearchFilter' }}
            />
          </StyledLi>
        </FilterButtonList>
      </View>
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
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={categoriesModalVisible}
        hideModal={hideCategoriesModal}
        filterBehaviour={FilterBehaviour.SEARCH}
        facets={facets}
      />
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible={searchPriceModalVisible}
        hideModal={hideSearchPriceModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
      <OfferDuoModal
        title="Duo"
        accessibilityLabel="Ne pas filtrer sur les offres duo et retourner aux résultats"
        isVisible={offerDuoModalVisible}
        hideModal={hideOfferDuoModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
      <VenueModal visible={venueModalVisible} dismissModal={hideVenueModal} />
      <DatesHoursModal
        title="Dates & heures"
        accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
        isVisible={datesHoursModalVisible}
        hideModal={hideDatesHoursModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
      <CalendarModal
        title="Dates"
        accessibilityLabel="Ne pas filtrer sur les dates puis retourner aux résultats"
        isVisible={calendarModalVisible}
        hideModal={hideCalendarModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
      <AccessibilityFiltersModal
        title="Accessibilité"
        accessibilityLabel="Ne pas filtrer sur les lieux accessibles puis retourner aux résultats"
        isVisible={accesibilityFiltersModalVisible}
        hideModal={hideAccessibilityModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
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

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + getSpacing(10),
  alignItems: 'center',
}))

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)({
  marginHorizontal: getSpacing(6),
})

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))

const StyledLi = styled(Li)({
  marginLeft: getSpacing(1),
  marginTop: getSpacing(1),
  marginBottom: getSpacing(1),
})

const ScrollToTopContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const StyledArtistSection = styled(ArtistSection)({
  marginTop: getSpacing(4),
})

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

const SearchResultsPlaceHolder = () => {
  const renderItem = useCallback(() => <HitPlaceholder />, [])

  return (
    <Container>
      <FlatList
        data={FAVORITE_LIST_PLACEHOLDER}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={<HeaderSearchResultsPlaceholder />}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={<Footer />}
        scrollEnabled={false}
      />
    </Container>
  )
}

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})
