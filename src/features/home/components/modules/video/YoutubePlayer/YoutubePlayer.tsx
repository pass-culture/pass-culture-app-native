import colorAlpha from 'color-alpha'
import React, { ReactElement, forwardRef, useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
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

import { YoutubePlayerRef, YoutubeRendererProps, YoutubeRendererRef } from './types'
import { YoutubeRenderer } from './YoutubeRenderer'

type YoutubePlayerProps = YoutubeRendererProps & {
  title?: string
  style?: StyleProp<ViewStyle>
  thumbnail?: ReactElement
  onLayout?: (event: LayoutChangeEvent) => void
  noThumbnail?: boolean
  duration?: Duration
  onPlayPress?: () => void
}

const PRESSABLE_STYLE = ({ pressed }: PressableStateCallbackType) => ({
  opacity: pressed ? 0.7 : 1,
  flex: 1,
})

export const YoutubePlayer = forwardRef(function YoutubePlayer(
  {
    title,
    noThumbnail,
    style,
    thumbnail,
    onReady,
    onLayout,
    play = true,
    duration,
    onPlayPress,
    ...playerProps
  }: YoutubePlayerProps,
  ref: React.ForwardedRef<YoutubePlayerRef>
) {
  const { designSystem } = useTheme()
  const innerVideoRef = React.useRef<YoutubeRendererRef>(null)
  const containerRef = useRef<View>(null)
  const [hasLaunched, setHasLaunched] = useState(false)

  const [playerVisible, setPlayerVisible] = useState(noThumbnail)
  const [playerReady, setPlayerReady] = useState(false)

  React.useImperativeHandle(ref, () => ({
    getDuration: () => Promise.resolve(0),
    getCurrentTime: () => Promise.resolve(0),
    getVideoUrl: () => Promise.resolve(''),
    getVolume: () => Promise.resolve(0),
    getAvailablePlaybackRates: () => Promise.resolve([0]),
    seekTo: () => false,
    isMuted: () => Promise.resolve(false),
    getPlaybackRate: () => Promise.resolve(0),
    unload: () => {
      setPlayerVisible(false)
      setPlayerReady(false)
    },
    measure: (callback) => containerRef.current?.measure?.(callback),
    ...(innerVideoRef.current ?? {}),
  }))

  const handleOnReady = () => {
    setPlayerReady(true)
    onReady?.()
  }

  const handleLaunchPlayer = useCallback(() => {
    if (!hasLaunched) {
      setHasLaunched(true)
      onPlayPress?.()
    }
    setPlayerVisible(true)
  }, [hasLaunched, onPlayPress])

  if (!noThumbnail && !thumbnail) {
    return null
  }

  return (
    <Container
      style={style}
      onLayout={onLayout}
      ref={containerRef}
      height={playerProps.height}
      width={playerProps.width}>
      {playerVisible ? (
        <YoutubeRenderer ref={innerVideoRef} {...playerProps} onReady={handleOnReady} play={play} />
      ) : null}

      {(!playerVisible || !playerReady) && duration ? (
        <TagContainer>
          <Tag
            label={duration.label}
            variant={TagVariant.DEFAULT}
            accessibilityLabel={duration.accessibilityLabel}
          />
        </TagContainer>
      ) : null}

      {(playerVisible && playerReady) || noThumbnail ? null : (
        <StyledAnimatedView height={playerProps.height} width={playerProps.width}>
          <Pressable
            accessibilityRole="imagebutton"
            onPress={handleLaunchPlayer}
            style={PRESSABLE_STYLE}>
            <ThumbnailOverlay>
              {playerVisible ? (
                <ActivityIndicator size="large" color={designSystem.color.icon.lockedInverted} />
              ) : (
                <IconContainer>
                  <StyledPlayIcon />
                </IconContainer>
              )}
            </ThumbnailOverlay>
            {thumbnail}
            <StyledLinearGradient testID="thumbnailGradient" />
          </Pressable>
        </StyledAnimatedView>
      )}
      {(!playerVisible || !playerReady) && title ? (
        <BottomTextContainer>
          <VideoTitle numberOfLines={2}>{title}</VideoTitle>
        </BottomTextContainer>
      ) : null}
    </Container>
  )
})

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

const StyledPlayIcon = styled(Play).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
  color2: theme.designSystem.color.icon.default,
  size: getSpacing(14),
}))``

const IconContainer = styled.View(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.xxl,
  padding: theme.designSystem.size.spacing.xxs,
  backgroundColor: theme.designSystem.color.background.default,
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

const TagContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.l,
  right: theme.designSystem.size.spacing.l,
  zIndex: 20,
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
