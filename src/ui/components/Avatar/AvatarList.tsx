import { mergeWith } from 'lodash'
import React, { FunctionComponent, Ref, useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { Artist } from 'features/venue/types'
import { AvatarProps } from 'ui/components/Avatar/Avatar'
import { AvatarListItem, AvatarListItemProps } from 'ui/components/Avatar/AvatarListItem'
import { Playlist } from 'ui/components/Playlist'
import { AVATAR_LARGE } from 'ui/theme/constants'

type AvatarListProps = {
  data: Artist[]
  avatarConfig?: AvatarProps
  onItemPress: (id: string, name: string) => void
  onViewableItemsChanged?: ({ viewableItems }: { viewableItems: ViewToken[] }) => void
  listRef?: Ref<FlatList>
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
}) => {
  const mergedAvatarConfig = mergeWith(
    avatarConfig,
    AVATAR_DEFAULT_CONFIG,
    (value, srcValue) => value ?? srcValue
  )
  const renderAvatar = useCallback(
    ({ item }: { item: AvatarListItemProps }) => (
      <AvatarListItem
        id={item.id}
        image={item.image}
        name={item.name}
        onItemPress={onItemPress}
        {...mergedAvatarConfig}
      />
    ),
    [onItemPress, mergedAvatarConfig]
  )

  const size = mergedAvatarConfig.size

  return (
    <Playlist
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderAvatar}
      itemHeight={size}
      itemWidth={size}
      FlatListComponent={FlatList}
      ref={listRef}
      onViewableItemsChanged={(info) =>
        onViewableItemsChanged?.({ viewableItems: info.viewableItems })
      }
    />
  )
}
