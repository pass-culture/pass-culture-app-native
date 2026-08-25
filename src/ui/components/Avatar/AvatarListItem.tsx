import React, { FunctionComponent } from 'react'
import { Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getLineHeightPx } from 'libs/parsers/getLineHeightPx'
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
  containerHeight?: number
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
  const theme = useTheme()
  const MAX_NUMBER_OF_LINES = 2
  const numberOfLines = useNumberOfLine(MAX_NUMBER_OF_LINES)

  const avatarToTextGap = theme.designSystem.size.spacing.s
  const contentToFooterGap = theme.designSystem.size.spacing.xl
  const artistNameLineHeight = getLineHeightPx(
    theme.designSystem.typography.bodyAccentS.lineHeight,
    Platform.OS === 'web'
  )
  const artistRoleLineHeight = getLineHeightPx(
    theme.designSystem.typography.bodyAccentXs.lineHeight,
    Platform.OS === 'web'
  )
  const contentHeight =
    (size ?? 0) +
    avatarToTextGap +
    artistNameLineHeight * MAX_NUMBER_OF_LINES +
    artistRoleLineHeight * MAX_NUMBER_OF_LINES +
    contentToFooterGap

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
    <ItemWithFooter gap={2} containerHeight={contentHeight}>
      {wrapped}
      {footer}
    </ItemWithFooter>
  )
}

const ItemWithFooter = styled(ViewGap)<{ containerHeight?: number }>(({ containerHeight }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: containerHeight,
}))

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
