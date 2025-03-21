import React, { ReactNode } from 'react'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeader/ArtistHeaderWrapper'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

type ArtistHeaderProps = {
  avatarImage?: ReactNode
  name: string
}

export const ArtistHeader = ({ avatarImage, name }: ArtistHeaderProps) => {
  return (
    <ArtistHeaderWrapper gap={4}>
      <Avatar borderWidth={6} size={AVATAR_LARGE}>
        {avatarImage ?? <DefaultAvatar />}
      </Avatar>
      <Typo.Title1>{name}</Typo.Title1>
    </ArtistHeaderWrapper>
  )
}
