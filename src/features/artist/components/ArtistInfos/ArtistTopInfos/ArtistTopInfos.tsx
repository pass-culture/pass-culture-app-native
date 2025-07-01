import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

import { ArtistTopInfosWrapper } from './ArtistTopInfosWrapper'

type ArtistHeaderProps = {
  avatarImage?: string
  name: string
}

export const ArtistTopInfos = ({ avatarImage, name }: ArtistHeaderProps) => {
  return (
    <ArtistTopInfosWrapper gap={4}>
      <Avatar borderWidth={6} size={AVATAR_LARGE}>
        {avatarImage ? (
          <StyledImage
            url={avatarImage}
            accessibilityRole={AccessibilityRole.IMAGE}
            accessibilityLabel={`image de ${name}`}
          />
        ) : (
          <DefaultAvatar />
        )}
      </Avatar>
      <Typo.Title1>{name}</Typo.Title1>
    </ArtistTopInfosWrapper>
  )
}

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
