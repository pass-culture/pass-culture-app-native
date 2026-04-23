import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, AppState } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO169,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { VideoPlayerProps } from 'features/home/components/modules/video/types'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics/provider'

import { YoutubePlayerRef } from './YoutubePlayer/types'
import { YoutubePlayer } from './YoutubePlayer/YoutubePlayer'

interface VideoPlayerNativeProps extends VideoPlayerProps {
  playerRef: RefObject<YoutubePlayerRef | null>
}

export const VideoPlayer: React.FC<VideoPlayerNativeProps> = ({
  youtubeVideoId,
  offer,
  moduleId,
  moduleName,
  homeEntryId,
  playerRef,
}) => {
  const { appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasFinishPlaying, setHasFinishPlaying] = useState(false)
  const [showErrorView, setShowErrorView] = React.useState(false)
  const { isDesktopViewport, modal } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions({
    isDesktopViewport,
    windowWidth,
    ratio: RATIO169,
    desktopMaxWidth: modal.desktopMaxWidth,
  })

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
    analytics.logConsultVideo({ from: 'home', moduleId, homeEntryId, offerId: offer?.objectID })
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
      <StyledVideoPlayerContainer marginTop={headerHeight}>
        <StyledYoutubePlayer
          ref={playerRef}
          initialPlayerParams={{ modestbranding: true, rel: false }}
          height={playerHeight}
          width={playerWidth}
          play={isPlaying}
          noThumbnail
          onReady={playVideo}
          videoId={youtubeVideoId}
          onChangeState={onChangeState}
          onError={() => {
            setShowErrorView(true)
          }}
        />
      </StyledVideoPlayerContainer>
      {hasFinishPlaying ? (
        <VideoEndView
          onPressReplay={replayVideo}
          offer={offer}
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

const StyledVideoPlayerContainer = styled.View<{ marginTop: number }>(({ theme, marginTop }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  overflow: 'hidden',
  marginTop,
}))

const StyledYoutubePlayer = styled(YoutubePlayer)({
  alignSelf: 'center',
})
