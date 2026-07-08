import React from 'react'
import styled from 'styled-components/native'

import { Artist } from 'features/venue/types'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Typo } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'

type ArtistItemProps = {
  artist: Artist
  onBeforeNavigate: (artist: Artist) => void
}

export const HorizontalArtistTile = ({ artist, onBeforeNavigate }: ArtistItemProps) => {
  const content = (
    <Container>
      <Avatar size={AVATAR_SMALL} {...artist}>
        {artist.image ? (
          <StyledImage url={artist.image} testID="artistAvatar" />
        ) : (
          <DefaultAvatar testID="defaultArtistAvatar" />
        )}
      </Avatar>
      <TextContainer>
        <ArtistName isDisabled={!artist.id}>{artist.name}</ArtistName>
        {artist.role ? <ArtistRole>{artist.role}</ArtistRole> : null}
      </TextContainer>
    </Container>
  )

  if (!artist.id) return content

  const accessibilityLabel = getComputedAccessibilityLabel(artist.name, artist.role)

  return (
    <InternalTouchableLink
      navigateTo={{ screen: 'Artist', params: { id: artist.id } }}
      accessibilityLabel={accessibilityLabel}
      onBeforeNavigate={() => onBeforeNavigate(artist)}>
      {content}
    </InternalTouchableLink>
  )
}

const Container = styled.View(({ theme }) => ({
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

const ArtistName = styled(Typo.Title4)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.designSystem.color.text.subtle : theme.designSystem.color.text.default,
}))

const ArtistRole = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
