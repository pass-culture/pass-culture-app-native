import React, { useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, AppState } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import styled, { useTheme } from 'styled-components/native'

import { getVideoPlayerDimensions } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

interface VideoPlayerProps {
  youtubeVideoId: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ youtubeVideoId }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(isDesktopViewport, windowWidth)

  // Make sure the video stop playing when app is not in an active state (eg: backgroung/inactive)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
        setIsPlaying(false)
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const playVideo = () => {
    setIsPlaying(true)
  }

  const onChangeState = useCallback((state: string) => {
    if (state === 'ended') {
      setIsPlaying(false)
    }
  }, [])

  return (
    <StyledVideoPlayerContainer>
      <YoutubePlayer
        initialPlayerParams={{ modestbranding: true, rel: false }}
        height={playerHeight}
        width={playerWidth}
        play={isPlaying}
        onReady={playVideo}
        videoId={youtubeVideoId}
        onChangeState={onChangeState}
        onError={(error) => {
          console.error(error)
        }}
        forceAndroidAutoplay
        webViewProps={{
          overScrollMode: 'never',
          bounces: false,
        }}
      />
    </StyledVideoPlayerContainer>
  )
}

const StyledVideoPlayerContainer = styled.View({
  backgroundColor: theme.colors.black,
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
})
