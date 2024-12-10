import React from 'react'
import { FlatList } from 'react-native-gesture-handler'

import { theme } from 'theme'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'
import { Playlist } from 'ui/components/Playlist'
import { Profile } from 'ui/svg/icons/Profile'
import { getSpacing, TypoDS } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

// Remove Fake Data
const avatarsData = [
  { id: 1, image: <Profile size={40} testID="profil" />, name: 'Oda' },
  { id: 2, image: <TypoDS.Title1>M.M</TypoDS.Title1>, name: 'MMMM' },
  { id: 3, name: 'Lolo' },
]

const GAP = getSpacing(2)
const PLAYLIST_ITEM_HEIGHT =
  AVATAR_LARGE + Number(theme.designSystem.typography.title4.fontSize) + GAP
const PLAYLIST_ITEM_WIDTH = AVATAR_LARGE

export const AvatarsList = () => {
  const renderAvatar = ({ item }: { item: (typeof avatarsData)[0] }) => (
    <AvatarListItem image={item.image} name={item.name} />
  )
  return (
    <Playlist
      data={avatarsData}
      keyExtractor={(item) => item.id}
      renderItem={renderAvatar}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      FlatListComponent={FlatList}
    />
  )
}
