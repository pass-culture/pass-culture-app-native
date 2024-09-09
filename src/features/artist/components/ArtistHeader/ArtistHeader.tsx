import React, { ReactNode } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { ArtistHeaderWrapper } from 'features/artist/components/ArtistHeader/ArtistHeaderWrapper'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
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

const DefaultAvatar = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.secondary, theme.colors.primary],
  useAngle: true,
  angle: -30,
  children: <BicolorProfile color={theme.colors.white} color2={theme.colors.white} size={50} />,
}))({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })
