import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { SearchList } from 'features/search/components/SearchList/SearchList'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour, LocationType } from 'features/search/enums'
import {
  FILTER_TYPES,
  useAppliedFilters,
} from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { useFilterCount } from 'features/search/helpers/useFilterCount/useFilterCount'
import { useHasPosition } from 'features/search/helpers/useHasPosition/useHasPosition'
import { useLocationChoice } from 'features/search/helpers/useLocationChoice/useLocationChoice'
import { useLocationType } from 'features/search/helpers/useLocationType/useLocationType'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { CategoriesModal } from 'features/search/pages/modals/CategoriesModal/CategoriesModal'
import { DatesHoursModal } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { LocationModal } from 'features/search/pages/modals/LocationModal/LocationModal'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { PriceModal } from 'features/search/pages/modals/PriceModal/PriceModal'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/geolocation'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { plural } from 'libs/plural'
import { Offer } from 'shared/offer/types'
import { Li } from 'ui/components/Li'
import { useModal } from 'ui/components/modals/useModal'
import { RenderItemProps } from 'ui/components/OptimizedList/types'
import { HitPlaceholder, NumberOfResultsPlaceholder } from 'ui/components/placeholders/Placeholders'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

const ANIMATION_DURATION = 700

export const SearchResults: React.FC = () => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const { navigate } = useNavigation<UseNavigationType>()
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
  const { searchState } = useSearch()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()
  const { user } = useAuthContext()
  const { userPosition } = useLocation()
  const previousUserPosition = usePrevious(userPosition)

  const isVenue = searchState.locationFilter.locationType === LocationType.VENUE

  // Execute log only on initial search fetch
  const previousIsLoading = usePrevious(isLoading)
  useEffect(() => {
    if (previousIsLoading && !isLoading) {
      analytics.logPerformSearch(searchState, nbHits)

      if (nbHits === 0) {
        analytics.logNoSearchResult(searchState.query, searchState.searchId)
      }
    }
  }, [isLoading, nbHits, previousIsLoading, searchState])

  const { params } = useRoute<UseRouteType<'Search'>>()
  const { section } = useLocationType(searchState)
  const { label: locationLabel } = useLocationChoice(section)
  const appliedFilters = useAppliedFilters(params ?? searchState)
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
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
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

  const hasPosition = useHasPosition()

  const activeFiltersCount = useFilterCount(searchState)

  const shouldRefetchResults = Boolean(
    (userPosition && !previousUserPosition) || (!userPosition && previousUserPosition)
  )

  useEffect(() => {
    if (shouldRefetchResults) {
      refetch()
    }
  }, [refetch, shouldRefetchResults])

  const [lastPage] = data?.pages?.slice(-1) ?? []

  const handleNextPage = useCallback(async () => {
    if (hasNextPage) {
      if (lastPage?.offers?.page > 0) {
        analytics.logSearchScrollToPage(lastPage.offers.page, params?.searchId)
      }
      await fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, lastPage?.offers?.page, params?.searchId])

  const onEndReached = useCallback(async () => {
    if (autoScrollEnabled) {
      await handleNextPage()
    }
  }, [autoScrollEnabled, handleNextPage])

  const renderItem = useCallback(
    ({ item, style, index }: RenderItemProps<Offer, unknown>) => {
      return (
        <Li style={style as ComponentProps<typeof Li>['style']}>
          <StyledHorizontalOfferTile
            offer={item}
            analyticsParams={{
              query: searchState.query,
              index: index,
              searchId: searchState.searchId,
              from: 'search',
            }}
          />
          <StyledHorizontalSeparator />
        </Li>
      )
    },
    [searchState.query, searchState.searchId]
  )

  const hasDuoOfferToggle = useMemo(() => {
    const isBeneficiary = !!user?.isBeneficiary
    const hasRemainingCredit = !!user?.domainsCredit?.all?.remaining

    return isBeneficiary && hasRemainingCredit
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining])

  const flagOnAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)

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

  return (
    <React.Fragment>
      {isFocused ? <Helmet title={helmetTitle} /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <View>
        <Spacer.Column numberOfSpaces={2} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Spacer.Row numberOfSpaces={5} />
          <Ul>
            <StyledLi>
              <FilterButton activeFilters={activeFiltersCount} />
            </StyledLi>

            <StyledLi>
              {flagOnAppLocation ? (
                <SingleFilterButton
                  label={isVenue ? locationLabel : 'Lieu culturel'}
                  testID="venueButton"
                  onPress={showVenueModal}
                  isSelected={isVenue}
                />
              ) : (
                <SingleFilterButton
                  label={hasPosition ? locationLabel : 'Localisation'}
                  testID="locationButton"
                  onPress={showLocationModal}
                  isSelected={hasPosition}
                />
              )}
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

            {!!hasDuoOfferToggle && (
              <StyledLi>
                <SingleFilterButton
                  label="Duo"
                  testID="DuoButton"
                  onPress={showOfferDuoModal}
                  isSelected={appliedFilters.includes(FILTER_TYPES.OFFER_DUO)}
                />
              </StyledLi>
            )}

            <StyledLastLi>
              <SingleFilterButton
                label="Dates & heures"
                testID="datesHoursButton"
                onPress={showDatesHoursModal}
                isSelected={appliedFilters.includes(FILTER_TYPES.DATES_HOURS)}
              />
            </StyledLastLi>
          </Ul>
          <Spacer.Row numberOfSpaces={5} />
        </ScrollView>
        <Spacer.Column numberOfSpaces={2} />
      </View>
      <Container testID="searchResults">
        <SearchList
          isFetchingNextPage={isFetchingNextPage}
          hits={hits}
          nbHits={nbHits}
          renderItem={renderItem}
          autoScrollEnabled={autoScrollEnabled}
          onEndReached={onEndReached}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onPress={handleNextPage}
          userData={userData}
          venuesUserData={venuesUserData}
        />
      </Container>
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
      <LocationModal
        title="Localisation"
        accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
        isVisible={locationModalVisible}
        hideModal={hideLocationModal}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
      <VenueModal
        visible={venueModalVisible}
        dismissModal={hideVenueModal}
        doAfterSearch={(payload: Partial<SearchState>) =>
          navigate(...getTabNavConfig('Search', payload))
        }
      />
      <DatesHoursModal
        title="Dates & heures"
        accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
        isVisible={datesHoursModalVisible}
        hideModal={hideDatesHoursModal}
        filterBehaviour={FilterBehaviour.SEARCH}
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

const StyledLi = styled(Li)({
  marginLeft: getSpacing(1),
  marginTop: getSpacing(1),
  marginBottom: getSpacing(1),
})

const StyledLastLi = styled(StyledLi)({
  marginRight: getSpacing(1),
})

const StyledHorizontalSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(4),
  marginHorizontal: getSpacing(6),
  width: 'auto',
  height: 2,
})

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
        ItemSeparatorComponent={StyledHorizontalSeparator}
        ListFooterComponent={ListFooterComponent}
        scrollEnabled={false}
      />
    </Container>
  )
}
