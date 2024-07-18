import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Platform, ScrollView, useWindowDimensions, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityFiltersModal } from 'features/accessibility/components/AccessibilityFiltersModal'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { NoSearchResult } from 'features/search/components/NoSearchResults/NoSearchResult'
import { SearchList } from 'features/search/components/SearchList/SearchList'
import { HEADER_SEARCH_VENUE_MAP } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  FILTER_TYPES,
  useAppliedFilters,
} from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { useFilterCount } from 'features/search/helpers/useFilterCount/useFilterCount'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DatesHoursModal } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { PriceModal } from 'features/search/pages/modals/PriceModal/PriceModal'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { plural } from 'libs/plural'
import { Offer } from 'shared/offer/types'
import { ellipseString } from 'shared/string/ellipseString'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { HitPlaceholder, NumberOfResultsPlaceholder } from 'ui/components/placeholders/Placeholders'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Ul } from 'ui/components/Ul'
import { Map } from 'ui/svg/icons/Map'
import { Sort } from 'ui/svg/icons/Sort'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { Helmet } from 'ui/web/global/Helmet'

const ANIMATION_DURATION = 700
const MAX_VENUE_CHARACTERS = 20

enum Tab {
  SEARCHLIST = 'Liste',
  MAP = 'Carte',
}

const isWeb = Platform.OS === 'web'

export const SearchResultsContent: React.FC = () => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const searchListRef = useRef<FlashList<Offer> | null>(null)
  const {
    hasNextPage,
    fetchNextPage,
    refetch,
    data,
    hits,
    nbHits,
    isLoading,
    isFetching,
    isFetchingNextPage,
    userData,
    venuesUserData,
    facets,
  } = useSearchResults()
  const { disabilities } = useAccessibilityFiltersContext()
  const { searchState } = useSearch()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()
  const { user } = useAuthContext()
  const { geolocPosition, selectedLocationMode } = useLocation()
  const previousGeolocPosition = usePrevious(geolocPosition)
  const shouldDisplayVenueMapInSearch = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH
  )
  const { height } = useWindowDimensions()
  const { top, tabBarHeight } = useCustomSafeInsets()
  const venueMapHeight = height - top - tabBarHeight - HEADER_SEARCH_VENUE_MAP
  const [isSearchListTab, setIsSearchListTab] = useState(true)
  const [defaultTab, setDefaultTab] = useState(Tab.SEARCHLIST)
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)

  const isVenue = !!searchState.venue

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

  const shouldRefetchResults = Boolean(
    (geolocPosition && !previousGeolocPosition) || (!geolocPosition && previousGeolocPosition)
  )

  useEffect(() => {
    if (shouldRefetchResults) {
      refetch()
    }
  }, [refetch, shouldRefetchResults])

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

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      const [lastPage] = data.pages.slice(-1)

      // @ts-expect-error: because of noUncheckedIndexedAccess
      if (lastPage.offers.page > 0) {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        analytics.logSearchScrollToPage(lastPage.offers.page, searchState.searchId)
      }
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage])

  const renderItem = useCallback<
    ({ item, index }: { item: Offer; index: number }) => React.JSX.Element
  >(
    ({ item: hit, index }) => (
      <StyledHorizontalOfferTile
        offer={hit}
        analyticsParams={{
          query: searchState.query,
          index: index,
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
        isFetchingNextPage={isFetchingNextPage}
        hits={hits}
        nbHits={nbHits}
        renderItem={renderItem}
        autoScrollEnabled={autoScrollEnabled}
        onEndReached={onEndReached}
        onScroll={onScroll}
        refreshing={isRefreshing}
        onRefresh={refetch}
        onPress={onEndReached}
        userData={userData}
        venuesUserData={venuesUserData}
      />
    ),
    [Tab.MAP]:
      selectedLocationMode === LocationMode.EVERYWHERE ? null : (
        <VenueMapView height={venueMapHeight} from="searchResults" />
      ),
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

  const renderSearchList = () => {
    if (nbHits === 0) {
      return (
        <NoSearchResultsWrapper>
          <NoSearchResult />
        </NoSearchResultsWrapper>
      )
    }
    return shouldDisplayTabLayout ? renderTabLayout() : tabPanels[Tab.SEARCHLIST]
  }

  return (
    <React.Fragment>
      {isFocused ? <Helmet title={helmetTitle} /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Spacer.Row numberOfSpaces={5} />
          <Ul>
            <StyledLi>
              <FilterButton activeFilters={activeFiltersCount} />
            </StyledLi>

            <StyledLi>
              <SingleFilterButton
                label={
                  searchState.venue
                    ? ellipseString(searchState.venue.label, MAX_VENUE_CHARACTERS)
                    : 'Lieu culturel'
                }
                testID="venueButton"
                onPress={showVenueModal}
                isSelected={isVenue}
              />
            </StyledLi>
            <StyledLi>
              <SingleFilterButton
                label="Catégories"
                testID="categoryButton"
                onPress={showCategoriesModal}
                isSelected={appliedFilters.includes(FILTER_TYPES.CATEGORIES)}
              />
            </StyledLi>

            <StyledLi>
              <SingleFilterButton
                label="Prix"
                testID="priceButton"
                onPress={showSearchPriceModal}
                isSelected={appliedFilters.includes(FILTER_TYPES.PRICES)}
              />
            </StyledLi>

            {hasDuoOfferToggle ? (
              <StyledLi>
                <SingleFilterButton
                  label="Duo"
                  testID="DuoButton"
                  onPress={showOfferDuoModal}
                  isSelected={appliedFilters.includes(FILTER_TYPES.OFFER_DUO)}
                />
              </StyledLi>
            ) : null}
            <StyledLi>
              <SingleFilterButton
                label="Dates & heures"
                testID="datesHoursButton"
                onPress={showDatesHoursModal}
                isSelected={appliedFilters.includes(FILTER_TYPES.DATES_HOURS)}
              />
            </StyledLi>
            <StyledLastLi>
              <SingleFilterButton
                label="Accessibilité"
                testID="lieuxAccessiblesButton"
                onPress={showAccessibilityModal}
                isSelected={appliedFilters.includes(FILTER_TYPES.ACCESSIBILITY)}
              />
            </StyledLastLi>
          </Ul>
          <Spacer.Row numberOfSpaces={5} />
        </ScrollView>
        <Spacer.Column numberOfSpaces={2} />
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

const StyledLastLi = styled(StyledLi)({
  marginRight: getSpacing(1),
})

const ScrollToTopContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

function SearchResultsPlaceHolder() {
  const renderItem = useCallback(() => <HitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <Container>
      <FlatList
        data={FAVORITE_LIST_PLACEHOLDER}
        renderItem={renderItem}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={ListFooterComponent}
        scrollEnabled={false}
      />
    </Container>
  )
}

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})
