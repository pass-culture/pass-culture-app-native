import React, { FunctionComponent } from 'react'

import { CategoryIdEnum, OfferArtist, SubcategoryIdEnum } from 'api/gen'
import { formatArtists } from 'features/artist/helpers/formatArtists'
import { getArtistSectionTitle } from 'features/artist/helpers/getArtistSectionTitle'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: OfferArtist[]
  offerCategoryId: CategoryIdEnum
  offerSubcategoryId: SubcategoryIdEnum
  onPlaylistItemPress: (artistId: string, artistName: string) => void
}

export const OfferArtistsSection: FunctionComponent<Props> = ({
  artists,
  offerCategoryId,
  offerSubcategoryId,
  onPlaylistItemPress,
}) => {
  const sectionTitle = getArtistSectionTitle(offerSubcategoryId)
  const formattedArtists = formatArtists(artists, offerCategoryId)

  return (
    <ViewGap gap={4}>
      <Typo.Title4 {...getHeadingAttrs(2)}>
        {artists.length === 1 ? sectionTitle.singular : sectionTitle.plural}
      </Typo.Title4>
      <AvatarList
        data={formattedArtists}
        avatarConfig={{ size: AVATAR_MEDIUM }}
        onItemPress={onPlaylistItemPress}
        withMargins={false}
      />
    </ViewGap>
  )
}
