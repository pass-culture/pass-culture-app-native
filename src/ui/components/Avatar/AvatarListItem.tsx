import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar, AvatarProps } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, TypoDS } from 'ui/theme'
import { AVATAR_LARGE } from 'ui/theme/constants'

export type AvatarListItemProps = {
  id: number
  name: string
  width: number
  onItemPress: (artistName: string) => void
  image?: string
} & AvatarProps

export const AvatarListItem: FunctionComponent<AvatarListItemProps> = ({
  id,
  image,
  name,
  width,
  onItemPress,
  ...props
}) => {
  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'Artist',
        params: {
          fromOfferId: id,
        },
      }}
      onBeforeNavigate={() => onItemPress(name)}>
      <StyledView gap={2}>
        <Avatar borderWidth={6} size={AVATAR_LARGE} {...props}>
          {image ? (
            <StyledImage
              url={image}
              accessibilityRole={AccessibilityRole.IMAGE}
              accessibilityLabel={`Avatar de lʼartiste ${name}`}
            />
          ) : (
            <DefaultAvatar />
          )}
        </Avatar>

        <ArtistName numberOfLines={2} maxWidth={width}>
          {name}
        </ArtistName>
      </StyledView>
    </InternalTouchableLink>
  )
}

const StyledView = styled(ViewGap)({
  flexDirection: 'column',
  paddingVertical: getSpacing(2),
})

const ArtistName = styled(TypoDS.BodyAccentS)<{ maxWidth: number }>(({ maxWidth }) => ({
  textAlign: 'center',
  maxWidth,
}))

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
