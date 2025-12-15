import colorAlpha from 'color-alpha'
import React, { ReactElement } from 'react'
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeOut } from 'react-native-reanimated'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Duration } from 'features/offer/types'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Play } from 'ui/svg/icons/Play'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  height: number
  onPress?: () => void
  thumbnail?: ReactElement
  width?: number | string
  title?: string
  duration?: Duration
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
}

const PRESSABLE_STYLE = ({ pressed }: PressableStateCallbackType) => ({
  opacity: pressed ? 0.7 : 1,
  flex: 1,
})

const VIEW_STYLE: ViewStyle = {
  flex: 1,
}

export const PlayerPreview = ({
  thumbnail,
  title,
  duration,
  onPress,
  isLoading = false,
  height,
  width,
  style,
}: Props) => {
  const { designSystem } = useTheme()

  const renderOverlayContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={designSystem.color.icon.lockedInverted} />
    }

    return onPress ? (
      <IconContainer testID="play-icon">
        <StyledPlayIcon />
      </IconContainer>
    ) : null
  }

  const InnerContent = (
    <React.Fragment>
      <ThumbnailOverlay>{renderOverlayContent()}</ThumbnailOverlay>
      {thumbnail}
      <StyledLinearGradient testID="thumbnailGradient" />
    </React.Fragment>
  )

  return (
    <Container
      style={style}
      height={height}
      width={width}
      accessibilityLabel={onPress ? undefined : 'Le lecteur vidéo est désactivé.'}>
      {duration ? (
        <TagContainer>
          <Tag
            label={duration.label}
            variant={TagVariant.DEFAULT}
            accessibilityLabel={duration.accessibilityLabel}
          />
        </TagContainer>
      ) : null}

      {thumbnail ? (
        <StyledAnimatedView height={height} width={width}>
          {onPress ? (
            <Pressable accessibilityRole="imagebutton" style={PRESSABLE_STYLE} onPress={onPress}>
              {InnerContent}
            </Pressable>
          ) : (
            <View style={VIEW_STYLE}>{InnerContent}</View>
          )}
        </StyledAnimatedView>
      ) : null}

      {title ? (
        <BottomTextContainer>
          <VideoTitle numberOfLines={2}>{title}</VideoTitle>
        </BottomTextContainer>
      ) : null}
    </Container>
  )
}

const Container = styled.View.attrs<{ height: number; width?: number | string }>(
  ({ height, width }) => ({
    height,
    width: width ?? '100%',
  })
)<{ height: number; width?: number | string }>(({ theme, width, height }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  width,
  height,
}))

const StyledAnimatedView = styled(Animated.View).attrs({
  exiting: FadeOut.duration(500),
})<{ height: number; width?: number | string }>(({ height, width = '100%' }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width,
  height,
  zIndex: 5,
  overflow: 'hidden',
}))

const ThumbnailOverlay = styled(View)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
})

const IconContainer = styled.View(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.xxl,
  padding: theme.designSystem.size.spacing.xxs,
  backgroundColor: theme.designSystem.color.background.default,
}))

const StyledPlayIcon = styled(Play).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  color2: theme.designSystem.color.icon.default,
  size: getSpacing(14),
  accessibilityLabel: 'Lire la vidéo',
}))``

const TagContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.l,
  right: theme.designSystem.size.spacing.l,
  zIndex: 20,
}))

const BottomTextContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: theme.designSystem.size.spacing.l,
  left: theme.designSystem.size.spacing.l,
  right: theme.designSystem.size.spacing.l,
  zIndex: 20,
}))

const VideoTitle = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledLinearGradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  useAngle: true,
  angle: 180,
  locations: [0, 0.4531, 0.6717],
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0.5),
    theme.designSystem.color.background.lockedInverted,
  ],
}))({
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 6,
})
