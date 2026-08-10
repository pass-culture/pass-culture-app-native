import { mergeWith } from 'lodash'
import React, { FunctionComponent, Ref, useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { Artist } from 'features/venue/types'
import { AvatarProps } from 'ui/components/Avatar/Avatar'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'
import { Playlist } from 'ui/components/Playlist'
import { AVATAR_LARGE } from 'ui/theme/constants'

type AvatarListProps = {
  data: Artist[]
  avatarConfig?: AvatarProps
  onItemPress: (id: string, name: string) => void
  onViewableItemsChanged?: ({ viewableItems }: { viewableItems: ViewToken[] }) => void
  listRef?: Ref<FlatList>
  withMargins?: boolean
  withPush?: boolean
  keyExtractor?: (item: Artist) => string
  renderItemFooter?: (item: Artist) => React.ReactNode
}

const AVATAR_DEFAULT_CONFIG = {
  size: AVATAR_LARGE,
  rounded: true,
} satisfies AvatarProps

export const AvatarList: FunctionComponent<AvatarListProps> = ({
  data,
  onItemPress,
  avatarConfig = {},
  listRef,
  onViewableItemsChanged,
  withMargins,
  withPush,
  keyExtractor,
  renderItemFooter,
}) => {
  const mergedAvatarConfig = mergeWith(
    avatarConfig,
    AVATAR_DEFAULT_CONFIG,
    (value, srcValue) => value ?? srcValue
  )
  const size = mergedAvatarConfig.size
  const contentHeight = size * 1.8

  const renderAvatar = useCallback(
    ({ item, height }: { item: Artist; height: number }) => (
      <AvatarListItem
        id={item.id}
        key={item.id}
        image={item.image}
        name={item.name}
        onItemPress={onItemPress}
        role={item.role}
        accessibilityLabel={item.accessibilityLabel}
        withPush={withPush}
        footer={renderItemFooter?.(item)}
        containerHeight={height}
        {...mergedAvatarConfig}
      />
    ),
    [onItemPress, mergedAvatarConfig, withPush, renderItemFooter]
  )

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[] }) => {
      onViewableItemsChanged?.({ viewableItems: info.viewableItems })
    },
    [onViewableItemsChanged]
  )

  return (
    <Playlist
      data={data}
      keyExtractor={keyExtractor ?? ((item) => item.id)}
      renderItem={renderAvatar}
      itemWidth={size}
      itemHeight={contentHeight}
      FlatListComponent={FlatList}
      ref={listRef}
      onViewableItemsChanged={handleViewableItemsChanged}
      withMargins={withMargins}
    />
  )
}
