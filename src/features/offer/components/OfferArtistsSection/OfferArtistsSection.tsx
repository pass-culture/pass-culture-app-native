import React, { FunctionComponent } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferArtist, SubcategoryIdEnum } from 'api/gen'
import { formatArtists } from 'features/artist/helpers/formatArtists'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'
import { getArtistSectionTitle } from 'features/artist/helpers/getArtistSectionTitle'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
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
  const { designSystem } = useTheme()
  const sectionTitle = getArtistSectionTitle(offerSubcategoryId)
  const formattedArtists = formatArtists(artists, offerCategoryId)

  const soloArtist = artists[0]

  return (
    <ViewGap gap={4}>
      <Typo.Title4 {...getHeadingAttrs(2)}>
        {artists.length === 1 ? sectionTitle.singular : sectionTitle.plural}
      </Typo.Title4>
      {artists.length === 1 && soloArtist ? (
        <InternalTouchableLink
          navigateTo={{ screen: 'Artist', params: { id: soloArtist.id } }}
          accessibilityLabel={`Accéder à la page artiste de ${soloArtist.name}`}
          accessibilityRole={accessibilityRoleInternalNavigation()}
          onBeforeNavigate={() => onPlaylistItemPress(soloArtist.id ?? '', soloArtist.name)}>
          <InfoHeader
            title={soloArtist.name}
            subtitle={soloArtist.role ? getArtistRole(soloArtist.role, offerCategoryId) : undefined}
            defaultThumbnailSize={AVATAR_MEDIUM}
            thumbnailComponent={
              <Avatar
                size={AVATAR_MEDIUM}
                rounded={false}
                borderRadius={designSystem.size.borderRadius.pill}>
                {soloArtist.image ? (
                  <ArtistImage url={soloArtist.image} testID="ArtistImage" />
                ) : (
                  <DefaultAvatar testID="defaultArtistAvatar" />
                )}
              </Avatar>
            }
            rightComponent={<RightFilled size={designSystem.size.icon.s} testID="RightFilled" />}
          />
        </InternalTouchableLink>
      ) : (
        <AvatarList
          data={formattedArtists}
          avatarConfig={{ size: AVATAR_MEDIUM }}
          onItemPress={onPlaylistItemPress}
          withMargins={false}
        />
      )}
    </ViewGap>
  )
}

const ArtistImage = styled(FastImage)(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))
