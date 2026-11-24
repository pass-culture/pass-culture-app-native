import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { NumberOfResults } from 'features/favorites/components/NumberOfResults'
import { FavoriteSortBy, Tab } from 'features/favorites/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

type FavoriteItem = { id: number }

export type FavoritesListProps<T extends FavoriteItem> = {
  favorites?: T[]
  renderItem: ListRenderItem<T>
  sortBy?: FavoriteSortBy
  isRefreshing: boolean
  onRefresh: () => void
  selectedTab: Tab
  enableFavoritesHub?: boolean
}

export const FavoritesList = <T extends FavoriteItem>({
  favorites,
  renderItem,
  sortBy,
  isRefreshing,
  onRefresh,
  selectedTab,
  enableFavoritesHub,
}: FavoritesListProps<T>) => {
  const flatListRef = useRef<FlatList<T> | null>(null)
  const { designSystem } = useTheme()

  const keyExtractor = useCallback((item: T) => item.id.toString(), [])

  const scrollToOffset = useCallback(
    () => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }),
    []
  )

  useEffect(() => {
    scrollToOffset()
  }, [scrollToOffset, sortBy])

  const contentContainerStyle = useMemo(
    () => ({
      flexGrow: 1,
      paddingBottom: TAB_BAR_COMP_HEIGHT + designSystem.size.spacing.l,
    }),
    [designSystem]
  )

  return (
    <FlatList
      ref={flatListRef}
      accessibilityRole={AccessibilityRole.LIST}
      listAs="ul"
      itemAs="li"
      testID="favoritesResultsFlatlist"
      data={favorites}
      extraData={sortBy}
      contentContainerStyle={contentContainerStyle}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.9}
      initialNumToRender={10}
      ListHeaderComponent={
        <NumberOfResults
          nbFavorites={favorites?.length ?? 0}
          tab={enableFavoritesHub ? selectedTab : undefined}
        />
      }
      ListEmptyComponent={<NoFavoritesResult />}
      ListFooterComponent={favorites?.length ? <Footer /> : null}
    />
  )
}

const Footer = styled.View(({ theme }) => ({ height: theme.designSystem.size.spacing['4xl'] }))
