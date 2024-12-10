import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { Avatar, AvatarProps } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

type AvatarListItemProps = {
  name: string
  image?: ReactNode
} & AvatarProps

export const AvatarListItem: FunctionComponent<AvatarListItemProps> = ({
  image,
  name,
  ...props
}) => {
  return (
    <StyledView gap={2}>
      <Avatar borderWidth={6} size={AVATAR_LARGE} {...props}>
        {image ?? <DefaultAvatar />}
      </Avatar>
      <ArtistName>{name}</ArtistName>
    </StyledView>
  )
}

const StyledView = styled(ViewGap)({
  flexDirection: 'column',
})

const ArtistName = styled(TypoDS.BodyAccentS)({
  textAlign: 'center',
})
