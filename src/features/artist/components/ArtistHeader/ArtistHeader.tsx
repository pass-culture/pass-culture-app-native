import React, { ReactNode } from 'react'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeader/ArtistHeaderWrapper'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { TypoDS } from 'ui/theme'
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
      <TypoDS.Title1>{name}</TypoDS.Title1>
    </ArtistHeaderWrapper>
  )
}
