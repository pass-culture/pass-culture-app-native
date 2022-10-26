import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, ActivityIndicator, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { ButtonContainer } from 'features/auth/signup/underageSignup/notificationPagesStyles'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { Hit, NoSearchResult, NumberOfResults } from 'features/search/atoms'
import { SingleFilterButton } from 'features/search/atoms/Buttons/FilterButton/SingleFilterButton'
import { GeolocationButton } from 'features/search/atoms/Buttons/GeolocationButton'
import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch'
import { ScrollToTopButton } from 'features/search/components/ScrollToTopButton'
import { useHasPosition } from 'features/search/components/useHasPosition'
import { useLocationChoice } from 'features/search/components/useLocationChoice'
import { Categories } from 'features/search/pages/Categories'
import { LocationModal } from 'features/search/pages/LocationModal'
import { OfferTypeModal } from 'features/search/pages/OfferTypeModal'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useLocationType } from 'features/search/pages/useLocationType'
import { useSearchResults } from 'features/search/pages/useSearchResults'
import { getPriceAsNumber } from 'features/search/utils/getPriceAsNumber'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { plural } from 'libs/plural'
import { SearchHit } from 'libs/search'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { useHeaderTransition as useOpacityTransition } from 'ui/components/headers/animationHelpers'
import { useModal } from 'ui/components/modals/useModal'
import { HitPlaceholder, NumberOfResultsPlaceholder } from 'ui/components/placeholders/Placeholders'
import { More } from 'ui/svg/icons/More'
import { getSpacing, Spacer } from 'ui/theme'
import { Helmet } from 'ui/web/global/Helmet'

const keyExtractor = (item: SearchHit) => item.objectID

const ANIMATION_DURATION = 700

export const SearchResults: React.FC = () => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const flatListRef = useRef<FlatList<SearchHit> | null>(null)
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
  } = useSearchResults()
  const { searchState } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition()

  const { params } = useRoute<UseRouteType<'Search'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { section } = useLocationType(searchState)
  const { label: locationLabel } = useLocationChoice(section)
  const offerCategories = params?.offerCategories ?? []
  const hasCategory = offerCategories.length > 0
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
    visible: offerTypeModalVisible,
    showModal: showOfferTypeModal,
    hideModal: hideOfferTypeModal,
  } = useModal(false)
  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal(false)
  const { position, showGeolocPermissionModal } = useGeolocation()
  const hasPosition = useHasPosition()

  const minPrice: number | undefined = getPriceAsNumber(params?.minPrice)
  const maxPrice: number | undefined = getPriceAsNumber(params?.maxPrice)
  const hasPrice = (minPrice !== undefined && minPrice > 0) || maxPrice !== undefined

  const hasType =
    params?.offerIsDuo ||
    params?.offerTypes?.isDigital ||
    params?.offerTypes?.isEvent ||
    params?.offerTypes?.isThing

  const hasDatesHours = Boolean(params?.date || params?.timeRange)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    // Despite the fact that the useEffect hook being called immediately,
    // scrollToOffset may not always have an effect for unknown reason,
    // debouncing scrollToOffset solves it.
    debounce(
      useCallback(() => {
        if (flatListRef && flatListRef.current) {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
        }
      }, [flatListRef])
    ),
    [nbHits, searchState]
  )

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      const [lastPage] = data.pages.slice(-1)
      if (lastPage.page > 0) analytics.logSearchScrollToPage(lastPage.page)
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage])

  const renderItem = useCallback(
    ({ item: hit, index }: { item: SearchHit; index: number }) => (
      <Hit hit={hit} query={searchState.query} index={index} />
    ),
    [searchState.query]
  )

  const redirectFilters = useCallback(() => {
    stagedDispatch({ type: 'SET_STATE_FROM_DEFAULT', payload: searchState })
    navigate('SearchFilter')
  }, [stagedDispatch, navigate, searchState])

  const ListHeaderComponent = useMemo(() => {
    const shouldDisplayGeolocationButton =
      position === null &&
      !params?.offerTypes?.isDigital &&
      params?.offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
      params?.offerCategories?.[0] !== SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE

    return (
      <React.Fragment>
        <NumberOfResults nbHits={nbHits} />
        {!!shouldDisplayGeolocationButton && (
          <GeolocationButtonContainer>
            <GeolocationButton onPress={showGeolocPermissionModal} />
          </GeolocationButtonContainer>
        )}
      </React.Fragment>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nbHits,
    searchState.locationFilter.locationType,
    position,
    params?.offerTypes?.isDigital,
    params?.offerCategories,
    showGeolocPermissionModal,
  ])
  const ListEmptyComponent = useMemo(() => <NoSearchResult />, [])

  const ListFooterComponent = useMemo(
    () => {
      const showMoreButton = !autoScrollEnabled && hits.length < nbHits
      return isFetchingNextPage && hits.length < nbHits ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ActivityIndicator />
          <Spacer.Column numberOfSpaces={4} />
          <Footer />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {!!showMoreButton && <Separator />}
          <Footer>
            {!!showMoreButton && (
              <ButtonSecondary
                mediumWidth
                icon={More}
                wording="Afficher plus de résultats"
                onPress={() => {
                  const button = (
                    flatListRef.current?.getNativeScrollRef() as unknown as HTMLElement
                  ).children[0].lastChild as HTMLElement
                  const offerLink = button?.previousSibling?.firstChild?.firstChild as HTMLElement
                  offerLink.focus()
                  offerLink.blur()
                  onEndReached()
                }}
              />
            )}
          </Footer>
        </React.Fragment>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetchingNextPage, hits.length, autoScrollEnabled]
  )

  if (showSkeleton) return <SearchResultsPlaceHolder />

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Spacer.Row numberOfSpaces={6} />
          <ButtonContainer>
            <SingleFilterButton
              label={hasPosition ? locationLabel : 'Localisation'}
              testID="locationButton"
              onPress={showLocationModal}
              isSelected={hasPosition}
            />
          </ButtonContainer>
          <Spacer.Row numberOfSpaces={2} />
          <ButtonContainer>
            <SingleFilterButton
              label="Catégories"
              testID="categoryButton"
              onPress={showCategoriesModal}
              isSelected={hasCategory}
            />
          </ButtonContainer>
          <React.Fragment>
            <Spacer.Row numberOfSpaces={2} />
            <ButtonContainer>
              <SingleFilterButton
                label="Prix"
                testID="priceButton"
                onPress={showSearchPriceModal}
                isSelected={hasPrice}
              />
            </ButtonContainer>
          </React.Fragment>
          <React.Fragment>
            <Spacer.Row numberOfSpaces={2} />
            <ButtonContainer>
              <SingleFilterButton
                label="Type"
                testID="typeButton"
                onPress={showOfferTypeModal}
                isSelected={!!hasType}
              />
            </ButtonContainer>
          </React.Fragment>
          <React.Fragment>
            <Spacer.Row numberOfSpaces={2} />
            <ButtonContainer>
              <SingleFilterButton
                label="Dates & heures"
                testID="datesHoursButton"
                onPress={redirectFilters}
                isSelected={!!hasDatesHours}
              />
            </ButtonContainer>
          </React.Fragment>
          <Spacer.Row numberOfSpaces={6} />
        </ScrollView>
        <Spacer.Column numberOfSpaces={4} />
      </View>
      <Container testID="searchResults">
        <FlatList
          listAs="ul"
          itemAs="li"
          ref={flatListRef}
          testID="searchResultsFlatlist"
          data={hits}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onEndReached={autoScrollEnabled ? onEndReached : undefined}
          scrollEnabled={nbHits > 0}
          ListEmptyComponent={ListEmptyComponent}
          onScroll={onScroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {nbHits > 0 && (
        <ScrollToTopContainer>
          <ScrollToTopButton
            transition={scrollButtonTransition}
            onPress={() => {
              flatListRef.current?.scrollToOffset({ offset: 0 })
            }}
          />
          <Spacer.BottomScreen />
        </ScrollToTopContainer>
      )}
      <Categories
        title="Catégories"
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible={categoriesModalVisible}
        hideModal={hideCategoriesModal}
      />
      <SearchPrice
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible={searchPriceModalVisible}
        hideModal={hideSearchPriceModal}
      />
      <OfferTypeModal
        title="Type d'offre"
        accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
        isVisible={offerTypeModalVisible}
        hideModal={hideOfferTypeModal}
      />
      <LocationModal
        title="Localisation"
        accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
        isVisible={locationModalVisible}
        hideModal={hideLocationModal}
      />
    </React.Fragment>
  )
}

const contentContainerStyle = { flexGrow: 1 }
const Container = styled.View({ flex: 1 })
const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + getSpacing(17),
  alignItems: 'center',
}))
const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))

const ScrollToTopContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: getSpacing(7),
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const GeolocationButtonContainer = styled.View({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
})

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

function SearchResultsPlaceHolder() {
  const renderItem = useCallback(() => <HitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
