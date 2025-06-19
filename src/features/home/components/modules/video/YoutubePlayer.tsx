import React, { ReactElement, forwardRef, useRef, useState } from 'react'
import {
  LayoutChangeEvent,
  MeasureOnSuccessCallback,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { FadeOut } from 'react-native-reanimated'
import RNYoutubeIframe, { YoutubeIframeProps, YoutubeIframeRef } from 'react-native-youtube-iframe'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

type YoutubePlayerProps = Omit<YoutubeIframeProps, 'webViewProps'> & {
  style?: StyleProp<ViewStyle>
  thumbnail?: ReactElement
  onLayout?: (event: LayoutChangeEvent) => void
  noThumbnail?: boolean
}

export type YoutubePlayerRef = YoutubeIframeRef & {
  unload: () => void
  measure?: (callback: MeasureOnSuccessCallback) => void
}

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
  const innerVideoRef = React.useRef<YoutubeIframeRef>(null)
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
    ...innerVideoRef.current,
  }))

  const handleOnReady = () => {
    setPlayerReady(true)
    onReady?.()
  }

  if (!noThumbnail && !thumbnail) {
    return null
  }

  return (
    <Container style={style} onLayout={onLayout} ref={containerRef} height={playerProps.height}>
      {playerVisible ? (
        <RNYoutubeIframe
          ref={innerVideoRef}
          {...playerProps}
          onReady={handleOnReady}
          play={play}
          webViewProps={{
            overScrollMode: 'never',
            bounces: false,
            scrollEnabled: false,
            injectedJavaScript: `
            document.querySelector("body").style.backgroundColor="${theme.designSystem.color.background.lockedInverted}";
            var element = document.getElementsByClassName("container")[0];
            element.style.position = "unset";
            true;
          `,
          }}
        />
      ) : null}

      {(playerVisible && playerReady) || noThumbnail ? null : (
        <StyledAnimatedView height={playerProps.height}>
          <Pressable accessibilityRole="imagebutton" onPress={() => setPlayerVisible(true)}>
            {thumbnail}
          </Pressable>
        </StyledAnimatedView>
      )}
    </Container>
  )
})

const Container = styled.View<{ height: number }>(({ height, theme }) => ({
  height,
  backgroundColor: theme.designSystem.color.background.lockedInverted,
}))

const StyledAnimatedView = styled(Animated.View).attrs({
  exiting: FadeOut.duration(500),
})<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height,
  zIndex: 5,
  overflow: 'hidden',
}))
