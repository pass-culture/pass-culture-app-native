import React, { ReactElement, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { PlayerPreview } from 'features/home/components/modules/video/PlayerPreview/PlayerPreview'
import { Duration } from 'features/offer/types'

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
  const innerVideoRef = React.useRef<YoutubeRendererRef>(null)
  const containerRef = useRef<View>(null)
  const [hasLaunched, setHasLaunched] = useState(false)

  const [playerVisible, setPlayerVisible] = useState(noThumbnail)

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
    },
    measure: (callback) => containerRef.current?.measure?.(callback),
    ...(innerVideoRef.current ?? {}),
  }))

  const handleOnReady = () => {
    onReady?.()
  }

  const handleLaunchPlayer = useCallback(() => {
    if (!hasLaunched) {
      setHasLaunched(true)
      onPlayPress?.()
    }
    setPlayerVisible(true)
  }, [hasLaunched, onPlayPress])

  useEffect(() => {
    if (play && !playerVisible) {
      handleLaunchPlayer()
    }
  }, [play, playerVisible, handleLaunchPlayer])

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
      ) : (
        <PlayerPreview
          thumbnail={thumbnail}
          title={title}
          duration={duration}
          onPress={handleLaunchPlayer}
          height={playerProps.height}
          width={playerProps.width}
          isLoading={hasLaunched}
        />
      )}
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
