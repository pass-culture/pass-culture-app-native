import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
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
  role?: string
  accessibilityLabel?: string
} & AvatarProps

export const AvatarListItem: FunctionComponent<AvatarListItemProps> = ({
  id,
  image,
  name,
  size,
  onItemPress,
  isFullWidth = false,
  role,
  accessibilityLabel,
  ...props
}) => {
  const content = (
    <StyledView gap={2} isFullWidth={isFullWidth}>
      <Avatar size={size} {...props}>
        {image ? (
          <StyledImage url={image} testID="artistAvatar" />
        ) : (
          <DefaultAvatar testID="defaultArtistAvatar" />
        )}
      </Avatar>
      <View>
        <ArtistName
          numberOfLines={2}
          maxWidth={size ?? 0}
          isFullWidth={isFullWidth}
          isDisabled={!id}>
          {name}
        </ArtistName>
        {role ? (
          <ArtistRole numberOfLines={2} maxWidth={size ?? 0} isFullWidth={isFullWidth}>
            {role}
          </ArtistRole>
        ) : null}
      </View>
    </StyledView>
  )

  if (!id) {
    return content
  }

  return (
    <InternalTouchableLink
      accessibilityLabel={accessibilityLabel ?? name}
      navigateTo={{ screen: 'Artist', params: { id: id.toString() } }}
      onBeforeNavigate={() => onItemPress(id.toString(), name)}>
      {content}
    </InternalTouchableLink>
  )
}

const ArtistName = styled(Typo.BodyAccentS)<{
  maxWidth: number
  isFullWidth: boolean
  isDisabled: boolean
}>(({ maxWidth, isFullWidth, isDisabled, theme }) => ({
  textAlign: 'center',
  maxWidth: isFullWidth ? '100%' : maxWidth,
  alignSelf: 'center',
  color: isDisabled ? theme.designSystem.color.text.subtle : theme.designSystem.color.text.default,
}))

const ArtistRole = styled(Typo.BodyAccentXs)<{ maxWidth: number; isFullWidth: boolean }>(
  ({ theme, maxWidth, isFullWidth }) => ({
    textAlign: 'center',
    maxWidth: isFullWidth ? '100%' : maxWidth,
    alignSelf: 'center',
    color: theme.designSystem.color.text.subtle,
  })
)

const StyledView = styled(ViewGap)<{ isFullWidth: boolean }>(({ isFullWidth }) => ({
  flexDirection: isFullWidth ? 'row' : 'column',
}))

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
