import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse } from 'api/gen'
import { FavoriteOffer } from 'features/favorites/components/FavoriteOffer'
import { NoFavoritesResult } from 'features/favorites/components/NoFavoritesResult'
import { NumberOfResults } from 'features/favorites/components/NumberOfResults'
import { FavoriteSortBy, Tab } from 'features/favorites/types'
import { UserProfile } from 'features/share/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getAvailableCredit } from 'shared/user/getAvailableCredit'
import { FavoriteHitPlaceholder } from 'ui/components/placeholders/Placeholders'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

export type FavoritesListProps = {
  favorites?: FavoriteResponse[]
  sortBy?: FavoriteSortBy
  isRefreshing: boolean
  onRefresh: () => void
  onBookOffer: (offer: FavoriteOfferResponse) => void
  selectedTab: Tab
  user?: UserProfile
  enableFavoritesHub?: boolean
}

const keyExtractor = (item: FavoriteResponse) => item.id.toString()

export const FavoritesList: FunctionComponent<FavoritesListProps> = ({
  favorites,
  sortBy,
  isRefreshing,
  onRefresh,
  onBookOffer,
  selectedTab,
  enableFavoritesHub,
  user,
}) => {
  const flatListRef = useRef<FlatList<FavoriteResponse> | null>(null)
  const credit = getAvailableCredit(user)
  const { designSystem } = useTheme()

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

  const renderItem = useCallback<ListRenderItem<FavoriteResponse>>(
    ({ item }) => {
      if (!user || !credit) return <FavoriteHitPlaceholder />
      if (selectedTab === Tab.OFFERS) {
        return <FavoriteOffer favorite={item} user={user} onInAppBooking={onBookOffer} />
      }
      return null
    },
    [user, credit, selectedTab, onBookOffer]
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

const Footer = styled.View(({ theme }) => ({ height: theme.designSystem.size.spacing.xxxxl }))
