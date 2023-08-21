import React, { useRef, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { isChrome } from 'react-device-detect'
import { useWindowDimensions } from 'react-native'
import YouTube, { YouTubeProps } from 'react-youtube'
import styled, { useTheme } from 'styled-components/native'

import { getVideoPlayerDimensions } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YouTubeEvent } from 'features/home/components/modules/video/types'
import { VideoEndView } from 'features/home/components/modules/video/VideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb } from 'libs/react-device-detect'
import { Offer } from 'shared/offer/types'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

interface VideoPlayerProps {
  youtubeVideoId: string
  offer: Offer
  onPressSeeOffer: () => void
  moduleId: string
  moduleName: string
  homeEntryId: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeVideoId,
  offer,
  onPressSeeOffer,
  moduleId,
  moduleName,
  homeEntryId,
}) => {
  const [hasFinishPlaying, setHasFinishPlaying] = useState(false)
  const [showErrorView, setShowErrorView] = React.useState(false)
  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(isDesktopViewport, windowWidth)

  const playerRef = useRef<YouTube>(null)

  const logConsultVideo = () => {
    analytics.logConsultVideo({ from: 'home', moduleId, homeEntryId })
  }

  const replayVideo = () => {
    playerRef.current?.internalPlayer.seekTo(0, true)
  }

  // remove the fullscreen video for Chrome - mobile as
  // the dimensions are not appropriated and not working
  const fs = isChrome && isMobileDeviceDetectOnWeb ? false : true

  const opts: YouTubeProps['opts'] = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      autoplay: true,
      modestbranding: true,
      rel: false,
      fs: fs,
    },
  }

  function onPlayerStateChange(event: YouTubeEvent) {
    if (event.data === YouTube.PlayerState.ENDED) {
      setHasFinishPlaying(true)
      analytics.logHasSeenAllVideo(moduleId)
    }
    if (event.data !== YouTube.PlayerState.ENDED && hasFinishPlaying === true)
      setHasFinishPlaying(false)
  }

  return (
    <React.Fragment>
      <StyledVideoPlayerContainer>
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
      {!!hasFinishPlaying && (
        <VideoEndView
          onPressReplay={replayVideo}
          offer={offer}
          onPressSeeOffer={onPressSeeOffer}
          style={{ height: playerHeight, width: playerWidth }}
          moduleId={moduleId}
          moduleName={moduleName}
          homeEntryId={homeEntryId}
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
