import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'

type ArtistAvatarProps = {
  imageUrl?: string | null
  size: number
}

export const ArtistAvatar: FunctionComponent<ArtistAvatarProps> = ({ imageUrl, size }) => {
  return (
    <Avatar size={size}>
      {imageUrl ? (
        <StyledImage url={imageUrl} testID="artistAvatar" />
      ) : (
        <DefaultAvatar testID="defaultArtistAvatar" size={size} />
      )}
    </Avatar>
  )
}

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
