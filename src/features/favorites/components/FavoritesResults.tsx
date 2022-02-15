import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse } from 'api/gen'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { Sort } from 'features/favorites/atoms/Buttons/Sort'
import { Favorite } from 'features/favorites/atoms/Favorite'
import { NumberOfResults } from 'features/favorites/atoms/NumberOfResults'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { FavoriteSortBy } from 'features/favorites/pages/FavoritesSorts'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useFavorites } from 'features/favorites/pages/useFavorites'
import {
  sortByAscendingPrice,
  sortByDistanceAroundMe,
  sortByIdDesc,
} from 'features/favorites/pages/utils/sorts'
import { useUserProfileInfo } from 'features/home/api'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import {
  FavoriteHitPlaceholder,
  NumberOfResultsPlaceholder,
} from 'features/search/components/Placeholders'
import { useGeolocation, GeoCoordinates } from 'libs/geolocation'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useNetwork } from 'libs/network/useNetwork'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

const keyExtractor = (item: FavoriteResponse) => item.id.toString()

function applySortBy(
  list: Array<FavoriteResponse>,
  sortBy: FavoriteSortBy,
  position: GeoCoordinates | null
) {
  if (sortBy === 'ASCENDING_PRICE') {
    list.sort(sortByAscendingPrice)
    return list
  } else if (sortBy === 'AROUND_ME') {
    list.sort(sortByDistanceAroundMe(position))
    return list
  } else if (sortBy === 'RECENTLY_ADDED') {
    list.sort(sortByIdDesc)
    return list
  } else {
    return list
  }
}

const ANIMATION_DURATION = 700

const StyledFlatList = styled(FlatList).attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: theme.tabBarHeight + getSpacing(4),
  },
}))``

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(4),
}

export const FavoritesResults: React.FC = React.memo(function FavoritesResults() {
  const networkInfo = useNetwork()
  const [offerToBook, setOfferToBook] = useState<FavoriteOfferResponse | null>(null)
  const flatListRef = useRef<FlatList<FavoriteResponse> | null>(null)
  const favoritesState = useFavoritesState()
  const { position } = useGeolocation()
  const { data, isLoading, isFetching, refetch } = useFavorites()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  const sortedFavorites = useMemo(() => {
    if (!data) {
      return undefined
    }
    return !favoritesState.sortBy
      ? data.favorites
      : applySortBy(data.favorites, favoritesState.sortBy, position)
  }, [data, favoritesState, position])

  const { data: user } = useUserProfileInfo()
  const credit = useAvailableCredit()

  useEffect(() => {
    if (flatListRef && flatListRef.current)
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
  }, [favoritesState.sortBy])

  const renderItem = useCallback(
    ({ item: favorite }: { item: FavoriteResponse }) => {
      if (!user || !credit) return <FavoriteHitPlaceholder />
      return <Favorite favorite={favorite} user={user} onInAppBooking={setOfferToBook} />
    },
    [credit, favoritesState, user, setOfferToBook]
  )

  const ListHeaderComponent = useMemo(
    () => <NumberOfResults nbFavorites={sortedFavorites ? sortedFavorites.length : 0} />,
    [sortedFavorites?.length]
  )
  const ListEmptyComponent = useMemo(() => <NoFavoritesResult />, [])
  const ListFooterComponent = useMemo(
    () => (sortedFavorites?.length ? <Spacer.Column numberOfSpaces={getSpacing(5)} /> : null),
    [sortedFavorites?.length]
  )

  const onRefresh = () => {
    if (networkInfo.isConnected) {
      refetch()
    }
  }

  if (showSkeleton) return <FavoritesResultsPlaceHolder />
  return (
    <React.Fragment>
      {!!offerToBook && (
        <BookingOfferModal
          visible
          dismissModal={() => setOfferToBook(null)}
          offerId={offerToBook.id}
        />
      )}
      <Container>
        <FlatList
          ref={flatListRef}
          testID="favoritesResultsFlatlist"
          data={sortedFavorites}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.9}
          scrollEnabled={sortedFavorites && sortedFavorites.length > 0}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={10}
        />
      </Container>
      {!!(sortedFavorites && sortedFavorites.length > 0) && (
        <SortContainer>
          <Sort />
          <Spacer.BottomScreen />
        </SortContainer>
      )}
    </React.Fragment>
  )
})

const Container = styled.View({ flex: 1 })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))

const SortContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  bottom: theme.tabBarHeight + getSpacing(6),
}))

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 10 }).map((_, index) => ({
  key: index.toString(),
}))

const FavoritesResultsPlaceHolder = () => {
  const renderItem = useCallback(() => <FavoriteHitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])

  return (
    <React.Fragment>
      <Container testID="FavoritesResultsPlaceHolder">
        <StyledFlatList
          data={FAVORITE_LIST_PLACEHOLDER}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          scrollEnabled={false}
        />
      </Container>
      <SortContainer>
        <Sort />
        <Spacer.BottomScreen />
      </SortContainer>
    </React.Fragment>
  )
}
