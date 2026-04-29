import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar, AvatarProps } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
export type AvatarListItemProps = {
  id: number | string
  name: string
  onItemPress: (id: string, name: string) => void
  image?: string
  isFullWidth?: boolean
} & AvatarProps

export const AvatarListItem: FunctionComponent<AvatarListItemProps> = ({
  id,
  image,
  name,
  size,
  onItemPress,
  isFullWidth = false,
  ...props
}) => {
  return (
    <InternalTouchableLink
      accessibilityLabel={name}
      navigateTo={{ screen: 'Artist', params: { id: id.toString() } }}
      onBeforeNavigate={() => onItemPress(id.toString(), name)}>
      <StyledView gap={2} isFullWidth={isFullWidth}>
        <Avatar size={size} {...props}>
          {image ? (
            <StyledImage url={image} testID="artistAvatar" />
          ) : (
            <DefaultAvatar testID="defaultArtistAvatar" />
          )}
        </Avatar>
        <ArtistName numberOfLines={2} maxWidth={size ?? 0} isFullWidth={isFullWidth}>
          {name}
        </ArtistName>
      </StyledView>
    </InternalTouchableLink>
  )
}

const ArtistName = styled(Typo.BodyAccentS)<{ maxWidth: number; isFullWidth: boolean }>(
  ({ maxWidth, isFullWidth }) => ({
    textAlign: 'center',
    maxWidth: isFullWidth ? '100%' : maxWidth,
    alignSelf: isFullWidth ? 'center' : 'self-start',
  })
)

const StyledView = styled(ViewGap)<{ isFullWidth: boolean }>(({ isFullWidth }) => ({
  flexDirection: isFullWidth ? 'row' : 'column',
}))

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
