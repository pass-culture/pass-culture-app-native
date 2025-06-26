import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, AppState } from 'react-native'
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO169,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { VideoPlayerProps } from 'features/home/components/modules/video/types'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics/provider'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

interface VideoPlayerNativeProps extends VideoPlayerProps {
  playerRef: RefObject<YoutubeIframeRef>
}

export const VideoPlayer: React.FC<VideoPlayerNativeProps> = ({
  youtubeVideoId,
  offer,
  onPressSeeOffer,
  moduleId,
  moduleName,
  homeEntryId,
  playerRef,
}) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasFinishPlaying, setHasFinishPlaying] = useState(false)
  const [showErrorView, setShowErrorView] = React.useState(false)
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO169
  )

  // Make sure the video stop playing when app is not in an active state (eg: background/inactive)
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
    analytics.logConsultVideo({ from: 'home', moduleId, homeEntryId })
  }

  const replayVideo = () => {
    playerRef.current?.seekTo(0, true)
    setIsPlaying(true)
    setHasFinishPlaying(false)
  }

  const onChangeState = useCallback(
    async (state: string) => {
      if (state === 'ended') {
        setIsPlaying(false)
        setHasFinishPlaying(true)
        if (playerRef.current) {
          const [videoDuration, seenDuration] = await Promise.all([
            playerRef.current.getDuration(),
            playerRef.current.getCurrentTime(),
          ])
          analytics.logHasSeenAllVideo({
            moduleId,
            videoDuration: Math.round(videoDuration),
            seenDuration: Math.round(seenDuration),
          })
        }
      }
    },
    [moduleId, playerRef]
  )

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
      {hasFinishPlaying ? (
        <VideoEndView
          onPressReplay={replayVideo}
          offer={offer}
          onPressSeeOffer={onPressSeeOffer}
          style={{ height: playerHeight, width: playerWidth }}
          moduleId={moduleId}
          moduleName={moduleName}
          homeEntryId={homeEntryId}
        />
      ) : null}
      {showErrorView ? (
        <VideoErrorView style={{ height: playerHeight, width: playerWidth }} />
      ) : null}
    </React.Fragment>
  )
}

const StyledVideoPlayerContainer = styled.View({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
})
