import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, AppState } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO169,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics/provider'
import { Offer } from 'shared/offer/types'

import { YoutubePlayerRef } from './YoutubePlayer/types'
import { YoutubePlayer } from './YoutubePlayer/YoutubePlayer'

type VideoPlayerNativeProps = {
  playerRef: RefObject<YoutubePlayerRef | null>
  youtubeVideoId: string
  offer?: Offer
  moduleId: string
  moduleName: string
  homeEntryId: string
  onPressSeeOffer: () => void
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export const VideoPlayer: React.FC<VideoPlayerNativeProps> = ({
  youtubeVideoId,
  offer,
  moduleId,
  moduleName,
  homeEntryId,
  playerRef,
  isPlaying,
  onPressSeeOffer,
  onPlay,
  onPause,
}) => {
  const { appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

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
        onPause()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [onPause])

  const playVideo = () => {
    onPlay()
    analytics.logConsultVideo({ from: 'home', moduleId, homeEntryId, offerId: offer?.objectID })
  }

  const replayVideo = () => {
    playerRef.current?.seekTo(0, true)
    onPlay()
    setHasFinishPlaying(false)
  }

  const onChangeState = useCallback(
    async (state: string) => {
      if (state === 'paused' && isPlaying) {
        onPause()
      }

      if (state === 'playing' && !isPlaying) {
        onPlay()
      }

      if (state === 'ended') {
        if (isPlaying) {
          onPause()
        }
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
    [moduleId, onPause, onPlay, playerRef, isPlaying]
  )
  return (
    <StyledVideoPlayerContainer marginTop={headerHeight}>
      <StyledYoutubePlayer
        ref={playerRef}
        initialPlayerParams={{ controls: false, rel: false, iv_load_policy: 3 }}
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
      {hasFinishPlaying ? (
        <VideoEndView
          onPressReplay={replayVideo}
          offer={offer}
          style={{ height: playerHeight, width: playerWidth }}
          moduleId={moduleId}
          moduleName={moduleName}
          homeEntryId={homeEntryId}
          onPressSeeOffer={onPressSeeOffer}
        />
      ) : null}
      {showErrorView ? (
        <VideoErrorView style={{ height: playerHeight, width: playerWidth }} />
      ) : null}
    </StyledVideoPlayerContainer>
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
