import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { Artist } from 'features/venue/types'
import { theme } from 'theme'
import { AvatarListItem, AvatarListItemProps } from 'ui/components/Avatar/AvatarListItem'
import { Playlist } from 'ui/components/Playlist'
import { getSpacing } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

type AvatarsListProps = {
  data: Artist[]
}

const GAP = getSpacing(2)
const PLAYLIST_ITEM_HEIGHT =
  AVATAR_LARGE + parseFloat(theme.designSystem.typography.title4.fontSize) + GAP
const PLAYLIST_ITEM_WIDTH = AVATAR_LARGE

export const AvatarsList: FunctionComponent<AvatarsListProps> = ({ data }) => {
  const renderAvatar = ({ item }: { item: AvatarListItemProps }) => (
    <AvatarListItem id={item.id} image={item.image} name={item.name} />
  )
  return (
    <Playlist
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderAvatar}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      FlatListComponent={FlatList}
    />
  )
}
