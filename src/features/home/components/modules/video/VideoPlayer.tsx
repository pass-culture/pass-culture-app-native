import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWindowDimensions, AppState } from 'react-native'
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'
import styled, { useTheme } from 'styled-components/native'

import { getVideoPlayerDimensions } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

interface VideoPlayerProps {
  youtubeVideoId: string
  offer: Offer
  onPressSeeOffer: () => void
  moduleId: string
  moduleName: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeVideoId,
  offer,
  onPressSeeOffer,
  moduleId,
  moduleName,
}) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasFinishPlaying, setHasFinishPlaying] = useState(false)
  const [showErrorView, setShowErrorView] = React.useState(false)
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(isDesktopViewport, windowWidth)

  const playerRef = useRef<YoutubeIframeRef>(null)

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

  const replayVideo = () => {
    playerRef.current?.seekTo(0, true)
    setIsPlaying(true)
    setHasFinishPlaying(false)
  }

  const onChangeState = useCallback((state: string) => {
    if (state === 'ended') {
      setIsPlaying(false)
      setHasFinishPlaying(true)
    }
  }, [])

  return (
    <React.Fragment>
      <StyledVideoPlayerContainer>
        <YoutubePlayer
          ref={playerRef}
          initialPlayerParams={{ modestbranding: true, rel: false }}
          height={playerHeight}
          width={playerWidth}
          play={isPlaying}
          onReady={playVideo}
          videoId={youtubeVideoId}
          onChangeState={onChangeState}
          onError={() => {
            setShowErrorView(true)
          }}
          forceAndroidAutoplay
          // Disable webview player scroll
          webViewProps={{
            overScrollMode: 'never',
            bounces: false,
            scrollEnabled: false,
          }}
        />
      </StyledVideoPlayerContainer>
      {!!hasFinishPlaying && (
        <VideoEndView
          onPressReplay={replayVideo}
          offer={offer}
          onPressSeeOffer={onPressSeeOffer}
          style={{ height: playerHeight, width: playerWidth }}
          moduleId={moduleId}
          moduleName={moduleName}
        />
      )}
      {!!showErrorView && <VideoErrorView style={{ height: playerHeight, width: playerWidth }} />}
    </React.Fragment>
  )
}

const StyledVideoPlayerContainer = styled.View({
  backgroundColor: theme.colors.black,
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
})
