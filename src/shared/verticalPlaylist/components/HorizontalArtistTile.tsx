import React from 'react'
import styled from 'styled-components/native'

import { Artist } from 'features/venue/types'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Profile } from 'ui/svg/icons/Profile'
import { Typo } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'

type ArtistItemProps = { artist: Artist }

export const HorizontalArtistTile = ({ artist }: ArtistItemProps) => {
  return (
    <Container
      navigateTo={{ screen: 'Artist', params: { id: artist.id } }}
      accessibilityLabel={artist.name}>
      <Avatar size={AVATAR_SMALL} {...artist}>
        {artist.image ? (
          <StyledImage url={artist.image} testID="artistAvatar" />
        ) : (
          <DefaultAvatarContainer testID="defaultArtistAvatar">
            <StyledProfile />
          </DefaultAvatarContainer>
        )}
      </Avatar>
      <TextContainer>
        <Typo.Title4>{artist.name}</Typo.Title4>
      </TextContainer>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.designSystem.size.spacing.m,
  alignItems: 'center',
}))

const TextContainer = styled.View({
  flex: 1,
})

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})

const DefaultAvatarContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.disabled,
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
  borderRadius: theme.designSystem.size.borderRadius.pill,
}))

const StyledProfile = styled(Profile).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.standard,
}))``
