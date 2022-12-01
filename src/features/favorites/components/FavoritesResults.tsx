import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { useFavorites } from 'features/favorites/api'
import { Sort } from 'features/favorites/components/Buttons/Sort'
import { Favorite } from 'features/favorites/components/Favorite'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { NumberOfResults } from 'features/favorites/components/NumberOfResults'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import {
  sortByAscendingPrice,
  sortByDistanceAroundMe,
  sortByIdDesc,
} from 'features/favorites/helpers/sorts'
import { FavoriteSortBy } from 'features/favorites/types'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { useGeolocation, GeoCoordinates } from 'libs/geolocation'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import {
  FavoriteHitPlaceholder,
  NumberOfResultsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

const keyExtractor = (item: FavoriteResponse) => item.id.toString()

function applySortBy(
  list: Array<FavoriteResponse>,
  sortBy: FavoriteSortBy,
  position: GeoCoordinates | null
) {
  if (!list) {
    // fix concurrency sentry/issues/288586
    return []
  } else if (sortBy === 'ASCENDING_PRICE') {
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
    paddingBottom: theme.tabBar.height + getSpacing(4),
  },
}))``

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(4),
}

export const FavoritesResults: React.FC = React.memo(function FavoritesResults() {
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

  const { user } = useAuthContext()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [credit, favoritesState, user, setOfferToBook]
  )

  const ListHeaderComponent = useMemo(
    () => <NumberOfResults nbFavorites={sortedFavorites ? sortedFavorites.length : 0} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedFavorites?.length]
  )
  const ListEmptyComponent = useMemo(() => <NoFavoritesResult />, [])
  const ListFooterComponent = useMemo(
    () => (sortedFavorites?.length ? <Spacer.Column numberOfSpaces={getSpacing(5)} /> : null),
    [sortedFavorites?.length]
  )

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
      {!!(sortedFavorites && sortedFavorites.length > 0) && (
        <SortContainer>
          <Sort />
          <Spacer.BottomScreen />
        </SortContainer>
      )}
      <Container>
        <FlatList
          listAs="ul"
          itemAs="li"
          ref={flatListRef}
          testID="favoritesResultsFlatlist"
          data={sortedFavorites}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onEndReachedThreshold={0.9}
          scrollEnabled={sortedFavorites && sortedFavorites.length > 0}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={10}
        />
      </Container>
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
  bottom: theme.tabBar.height + getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 10 }).map((_, index) => ({
  key: index.toString(),
}))

const FavoritesResultsPlaceHolder = () => {
  const renderItem = useCallback(() => <FavoriteHitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])

  return (
    <React.Fragment>
      <SortContainer>
        <Sort />
        <Spacer.BottomScreen />
      </SortContainer>
      <Container testID="FavoritesResultsPlaceHolder">
        <StyledFlatList
          data={FAVORITE_LIST_PLACEHOLDER}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          scrollEnabled={false}
        />
      </Container>
    </React.Fragment>
  )
}
