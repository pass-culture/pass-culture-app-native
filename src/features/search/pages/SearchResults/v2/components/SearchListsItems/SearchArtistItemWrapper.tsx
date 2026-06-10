import React, { FC } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { Artist } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'
import { AVATAR_SMALL } from 'ui/theme/constants'

type SearchArtistItemWrapperProps = {
  item: Artist
}
export const SearchArtistItemWrapper: FC<SearchArtistItemWrapperProps> = ({ item }) => {
  const {
    searchState: { searchId },
  } = useSearch()

  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      searchId,
      from: 'search',
    })
  }

  return (
    <AvatarListItem
      id={item.id}
      image={item.image}
      name={item.name}
      onItemPress={handleOnArtistPlaylistItemPress}
      size={AVATAR_SMALL}
      isFullWidth
    />
  )
}
