import React, { ReactElement, forwardRef, useRef, useState } from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { FadeOut } from 'react-native-reanimated'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Play } from 'ui/svg/icons/Play'
import { getSpacing } from 'ui/theme'

import { YoutubePlayerRef, YoutubeRendererProps, YoutubeRendererRef } from './types'
import { YoutubeRenderer } from './YoutubeRenderer'

type YoutubePlayerProps = YoutubeRendererProps & {
  style?: StyleProp<ViewStyle>
  thumbnail?: ReactElement
  onLayout?: (event: LayoutChangeEvent) => void
  noThumbnail?: boolean
}

const PRESSABLE_STYLE = ({ pressed }: PressableStateCallbackType) => ({
  opacity: pressed ? 0.7 : 1,
  flex: 1,
})

export const YoutubePlayer = forwardRef(function YoutubePlayer(
  {
    noThumbnail,
    style,
    thumbnail,
    onReady,
    onLayout,
    play = true,
    ...playerProps
  }: YoutubePlayerProps,
  ref: React.ForwardedRef<YoutubePlayerRef>
) {
  const theme = useTheme()
  const innerVideoRef = React.useRef<YoutubeRendererRef>(null)
  const containerRef = useRef<View>(null)

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

      {(playerVisible && playerReady) || noThumbnail ? null : (
        <StyledAnimatedView height={playerProps.height} width={playerProps.width}>
          <Pressable
            accessibilityRole="imagebutton"
            onPress={() => setPlayerVisible(true)}
            style={PRESSABLE_STYLE}>
            <ThumbnailOverlay>
              {playerVisible ? (
                <ActivityIndicator
                  size="large"
                  color={theme.designSystem.color.icon.lockedInverted}
                />
              ) : (
                <IconContainer>
                  <StyledPlayIcon />
                </IconContainer>
              )}
            </ThumbnailOverlay>
            {thumbnail}
          </Pressable>
        </StyledAnimatedView>
      )}
    </Container>
  )
})

const Container = styled.View<{ height: number; width?: number | string }>(
  ({ height, width = '100%', theme }) => ({
    height,
    width,
    backgroundColor: theme.designSystem.color.background.lockedInverted,
  })
)

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
