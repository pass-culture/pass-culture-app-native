import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
import { Avatar, AvatarProps } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
type AvatarListItemProps = {
  id: number | string
  name: string
  onItemPress: (id: string, name: string) => void
  image?: string
  isFullWidth?: boolean
  role?: string
  accessibilityLabel?: string
  withPush?: boolean
  footer?: React.ReactNode
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
  withPush,
  footer,
  ...props
}) => {
  const numberOfLines = useNumberOfLine(2)
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
          numberOfLines={numberOfLines}
          maxWidth={size ?? 0}
          isFullWidth={isFullWidth}
          isDisabled={!id}>
          {name}
        </ArtistName>
        {role ? (
          <ArtistRole numberOfLines={numberOfLines} maxWidth={size ?? 0} isFullWidth={isFullWidth}>
            {role}
          </ArtistRole>
        ) : null}
      </View>
    </StyledView>
  )

  // The footer is rendered as a sibling of the navigation link (never nested inside it),
  // because InternalTouchableLink renders an <a> on web and interactive elements
  // must not be nested inside anchors.
  const wrapped = id ? (
    <InternalTouchableLink
      accessibilityLabel={accessibilityLabel ?? name}
      navigateTo={{ screen: 'Artist', params: { id: id.toString() }, withPush }}
      onBeforeNavigate={() => onItemPress(id.toString(), name)}>
      {content}
    </InternalTouchableLink>
  ) : (
    content
  )

  if (!footer) {
    return wrapped
  }

  return (
    <ItemWithFooter gap={2}>
      {wrapped}
      {footer}
    </ItemWithFooter>
  )
}

const ItemWithFooter = styled(ViewGap)({
  alignItems: 'center',
})

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
