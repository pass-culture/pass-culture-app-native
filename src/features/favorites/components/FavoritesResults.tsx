import flatten from 'lodash.flatten'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { FavoriteResponse } from 'api/gen'
import { Filter } from 'features/favorites/atoms/Buttons/Filter'
import { Favorite } from 'features/favorites/atoms/Favorite'
import { NumberOfResults } from 'features/favorites/atoms/NumberOfResults'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useFavoritesResults } from 'features/favorites/pages/useFavoritesResults'
import { FadeScrollingView, useDebouncedScrolling } from 'features/search/atoms'
import { HitPlaceholder, NumberOfResultsPlaceholder } from 'features/search/components/Placeholders'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT } from 'ui/theme'

const keyExtractor = (item: FavoriteResponse) => item.id.toString()

export const FavoritesResults: React.FC = () => {
  const flatListRef = useRef<FlatList<FavoriteResponse> | null>(null)
  const { isScrolling, handleIsScrolling } = useDebouncedScrolling()
  const { hasNextPage, fetchNextPage, data, isLoading, isFetchingNextPage } = useFavoritesResults()
  const favoritesState = useFavoritesState()

  const favorites: FavoriteResponse[] = useMemo(
    () => flatten(data?.pages.map((page) => page.favorites)),
    [data?.pages]
  )
  const { nbFavorites } = data?.pages[0] || { nbFavorites: 0 }

  useEffect(() => {
    if (flatListRef && flatListRef.current)
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
  }, [nbFavorites])

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage])

  const onScrollEndDrag = useCallback(() => handleIsScrolling(false), [])
  const onScrollBeginDrag = useCallback(() => handleIsScrolling(true), [])

  const renderItem = useCallback(
    ({ item: favorite }: { item: FavoriteResponse }) => <Favorite favorite={favorite} />,
    [favoritesState]
  )

  const ListHeaderComponent = useMemo(() => <NumberOfResults nbFavorites={nbFavorites} />, [
    nbFavorites,
  ])
  const ListEmptyComponent = useMemo(() => <NoFavoritesResult />, [])
  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage && favorites.length < nbFavorites ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ActivityIndicator />
          <Spacer.Column numberOfSpaces={4} />
          <Footer />
        </React.Fragment>
      ) : (
        <Footer />
      ),
    [isFetchingNextPage, favorites.length]
  )

  if (isLoading || !data) return <FavoritesResultsPlaceHolder />
  return (
    <React.Fragment>
      <Container>
        <FlatList
          ref={flatListRef}
          testID="favoritesResultsFlatlist"
          data={favorites}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onScrollEndDrag={onScrollEndDrag}
          onScrollBeginDrag={onScrollBeginDrag}
          scrollEnabled={nbFavorites > 0}
          ListEmptyComponent={ListEmptyComponent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {nbFavorites > 0 && (
        <FilterContainer>
          <FadeScrollingView isScrolling={isScrolling}>
            <Filter />
          </FadeScrollingView>
          <Spacer.BottomScreen />
        </FilterContainer>
      )}
    </React.Fragment>
  )
}

const contentContainerStyle = { flexGrow: 1 }
const Container = styled.View({ height: '100%' })
const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

const FavoritesResultsPlaceHolder = () => {
  const renderItem = useCallback(() => <HitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <React.Fragment>
      <Container testID="FavoritesResultsPlaceHolder">
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
      <FilterContainer>
        <Filter />
        <Spacer.BottomScreen />
      </FilterContainer>
    </React.Fragment>
  )
}
