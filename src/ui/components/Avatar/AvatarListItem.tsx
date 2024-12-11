import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { Avatar, AvatarProps } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

export type AvatarListItemProps = {
  id: number
  name: string
  image?: ReactNode
} & AvatarProps

export const AvatarListItem: FunctionComponent<AvatarListItemProps> = ({
  id,
  image,
  name,
  ...props
}) => {
  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'Artist',
        params: {
          id,
        },
        withPush: true,
      }}>
      <StyledView gap={2}>
        <Avatar borderWidth={6} size={AVATAR_LARGE} {...props}>
          {image ?? <DefaultAvatar />}
        </Avatar>
        <ArtistName>{name}</ArtistName>
      </StyledView>
    </InternalTouchableLink>
  )
}

const StyledView = styled(ViewGap)({
  flexDirection: 'column',
})

const ArtistName = styled(TypoDS.BodyAccentS)({
  textAlign: 'center',
})
