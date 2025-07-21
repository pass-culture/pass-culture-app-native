import React, { RefObject, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { isChrome } from 'react-device-detect'
import { useWindowDimensions } from 'react-native'
import YouTube, { YouTubeProps } from 'react-youtube'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO169,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { VideoPlayerProps, YouTubeEvent } from 'features/home/components/modules/video/types'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics/provider'
// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb } from 'libs/react-device-detect'
import { getSpacing } from 'ui/theme'

interface VideoPlayerWebProps extends VideoPlayerProps {
  playerRef: RefObject<YouTube | null>
}

export const VideoPlayerWeb: React.FC<VideoPlayerWebProps> = ({
  youtubeVideoId,
  offer,
  onPressSeeOffer,
  moduleId,
  moduleName,
  homeEntryId,
  playerRef,
}) => {
  const [hasFinishPlaying, setHasFinishPlaying] = useState(false)
  const [showErrorView, setShowErrorView] = React.useState(false)
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO169
  )

  const logConsultVideo = () => {
    analytics.logConsultVideo({ from: 'home', moduleId, homeEntryId, offerId: offer?.objectID })
  }

  const replayVideo = () => {
    playerRef?.current?.internalPlayer.seekTo(0, true)
  }

  // remove the fullscreen video for Chrome - mobile as
  // the dimensions are not appropriated and not working
  const isFullscreenEnabled = !(isChrome && isMobileDeviceDetectOnWeb)

  const opts: YouTubeProps['opts'] = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      autoplay: true,
      modestbranding: true,
      rel: false,
      fs: isFullscreenEnabled,
    },
  }

  async function onPlayerStateChange(event: YouTubeEvent) {
    if (event.data === YouTube.PlayerState.ENDED) {
      setHasFinishPlaying(true)
      if (playerRef.current) {
        const [videoDuration, seenDuration] = await Promise.all([
          playerRef.current.internalPlayer.getDuration(),
          playerRef.current.internalPlayer.getCurrentTime(),
        ])
        analytics.logHasSeenAllVideo({
          moduleId,
          videoDuration: Math.round(videoDuration),
          seenDuration: Math.round(seenDuration),
        })
      }
      if (event.data !== YouTube.PlayerState.ENDED && hasFinishPlaying === true)
        setHasFinishPlaying(false)
    }
  }

  return (
    <React.Fragment>
      <StyledVideoPlayerContainer>
        {/* @ts-expect-error - type incompatibility with React 19 */}
        <YouTube
          ref={playerRef}
          videoId={youtubeVideoId}
          opts={opts}
          onReady={logConsultVideo}
          onStateChange={onPlayerStateChange}
          onError={() => {
            setShowErrorView(true)
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

const StyledVideoPlayerContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
}))
