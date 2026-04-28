import React from 'react'
import styled from 'styled-components/native'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeader/ArtistHeaderWrapper'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

type ArtistHeaderProps = {
  avatarImage?: string | null
  name: string
}

export const ArtistHeader = ({ avatarImage, name }: ArtistHeaderProps) => {
  return (
    <ArtistHeaderWrapper gap={4}>
      <Avatar size={AVATAR_LARGE}>
        {avatarImage ? (
          <StyledImage url={avatarImage} testID="artistAvatar" />
        ) : (
          <DefaultAvatar testID="defaultArtistAvatar" size={50} />
        )}
      </Avatar>
      <Typo.Title1>{name}</Typo.Title1>
    </ArtistHeaderWrapper>
  )
}

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
