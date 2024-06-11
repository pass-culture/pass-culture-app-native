import colorAlpha from 'color-alpha'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWindowDimensions, AppState, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import YouTubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO710,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { VerticalVideoEndView } from 'features/home/components/modules/video/VerticalVideoEndView'
import { VerticalVideoErrorView } from 'features/home/components/modules/video/VerticalVideoErrorView'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { theme } from 'theme'
import { PlayV2 } from 'ui/svg/icons/PlayV2'
import { SoundOff } from 'ui/svg/icons/SoundOff'
import { SoundOn } from 'ui/svg/icons/SoundOn'
import { getSpacing } from 'ui/theme'

const PLAYER_CONTROLS_HEIGHT = getSpacing(0)

interface VideoPlayerProps {
  videoSources: string[]
  playNextVideo: () => void
  currentIndex: number
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  hasFinishedPlaying: boolean
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
}

export const VerticalVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSources,
  currentIndex,
  playNextVideo,
  isPlaying,
  setIsPlaying,
  hasFinishedPlaying,
  setHasFinishedPlaying,
}) => {
  const [showErrorView, setShowErrorView] = useState(false)
  const [elapsed, setElapsed] = useState(1)
  const [isMuted, setIsMuted] = useState(true)

  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO710
  )

  const playerRef = useRef<YoutubeIframeRef>(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const getVideoDuration = async () => {
      return playerRef.current?.getDuration()
    }

    const interval = setInterval(async () => {
      const videoDuration = await getVideoDuration()
      const elapsed_sec = await playerRef.current?.getCurrentTime()
      if (elapsed_sec && videoDuration) setElapsed(elapsed_sec / videoDuration)
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const playVideo = () => {
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  const pauseVideo = () => {
    setIsPlaying(false)
  }

  const replayVideo = () => {
    playerRef.current?.seekTo(0, false)
    setHasFinishedPlaying(false)
    setIsPlaying(true)
  }

  const intersectionObserverListener = (isInView: boolean) => {
    if (!isInView) pauseVideo()
  }

  const onChangeState = useCallback(
    (state: string) => {
      if (state === 'ended') {
        setHasFinishedPlaying(true)
        setIsPlaying(false)
        setIsPlaying(false)
      } else if (state === 'paused') {
        setIsPlaying(false)
      } else if (state === 'playing') {
        setIsPlaying(true)
      } else if (state === 'unstarted') {
        setIsPlaying(true)
      }
    },
    [setIsPlaying, setHasFinishedPlaying]
  )

  const PlayerCalque = () => {
    if (hasFinishedPlaying) {
      return (
        <VerticalVideoEndView
          style={{ height: playerHeight, width: windowWidth }}
          onPressReplay={replayVideo}
          onPressNext={playNextVideo}
          hasMultipleSources={videoSources.length > 1}
        />
      )
    }
    return (
      <PressListener onPress={togglePlay}>
        <Calque
          style={{ height: playerHeight - PLAYER_CONTROLS_HEIGHT }}
          start={{ x: 0, y: 0.9 }}
          end={{ x: 0, y: 1 }}
          colors={[colorAlpha(theme.colors.black, 0.9), colorAlpha(theme.colors.black, 0.9)]}>
          <ButtonsContainer>
            <ButtonWithCaption
              onPress={togglePlay}
              accessibilityLabel="Continuer à regarder"
              wording="Continuer à regarder"
              icon={StyledPlayIcon}
            />
          </ButtonsContainer>
        </Calque>
      </PressListener>
    )
  }

  return (
    <IntersectionObserver
      onChange={(inView) => intersectionObserverListener(inView)}
      key="verticalVideoPlayer">
      <StyledVideoPlayerContainer style={{ height: playerHeight }}>
        <StyledYoutubePlayer
          ref={playerRef}
          initialPlayerParams={{
            modestbranding: true,
            color: 'white',
            showClosedCaptions: false,
            controls: false,
          }}
          height={playerHeight}
          width={playerWidth}
          play={isPlaying}
          onReady={isPlaying ? playVideo : pauseVideo}
          onError={() => setShowErrorView(true)}
          videoId={videoSources[currentIndex]}
          mute={isMuted}
          webViewProps={{
            injectedJavaScript: `
            var element = document.getElementsByClassName("container")[0];
            element.style.position = "unset";
            true;
          `,
            scrollEnabled: false,
          }}
          onChangeState={onChangeState}
        />
      </StyledVideoPlayerContainer>

      {isPlaying ? (
        <PressListener
          style={{ height: playerHeight - PLAYER_CONTROLS_HEIGHT }}
          onPress={togglePlay}
        />
      ) : (
        <React.Fragment>
          <PlayerCalque />
        </React.Fragment>
      )}

      {isPlaying ? (
        <StyledProgressContainer>
          <ControlsContainer>
            <ButtonWithCaption
              onPress={togglePlay}
              icon={StyledSmallPlayIcon}
              wording=""
              accessibilityLabel="Jouer ou mettre en pause la vidéo"
            />
            <ButtonWithCaption
              onPress={toggleMute}
              icon={isMuted ? StyledMutedIcon : StyledUnmutedIcon}
              wording=""
              accessibilityLabel="Désactiver le son"
            />
          </ControlsContainer>
          <CreditProgressBar progress={elapsed} height="small" />
        </StyledProgressContainer>
      ) : null}

      {showErrorView ? (
        <VerticalVideoErrorView style={{ height: playerHeight, width: playerWidth }} />
      ) : null}
    </IntersectionObserver>
  )
}

const StyledVideoPlayerContainer = styled.View({
  backgroundColor: theme.colors.black,
  alignSelf: 'stretch',
})

const Calque = styled(LinearGradient)({
  position: 'absolute',
  left: -getSpacing(6),
  right: -getSpacing(6),
  top: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
})

const PressListener = styled.Pressable({
  position: 'absolute',
  left: -getSpacing(6),
  right: -getSpacing(6),
  top: 0,
  flexDirection: 'row',
})

const ButtonsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const ControlsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledPlayIcon = styled(PlayV2).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.standard,
}))``

const StyledUnmutedIcon = styled(SoundOn).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledSmallPlayIcon = styled(PlayV2).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledMutedIcon = styled(SoundOff).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledProgressContainer = styled.View({
  position: 'absolute',
  bottom: getSpacing(2),
  left: getSpacing(2),
  right: getSpacing(2),
})

// The app crashed when the youtube player is used with react-navigation. This fixes the issue (source: https://lonelycpp.github.io/react-native-youtube-iframe/navigation-crash/#2-tweak-webview-props)
const StyledYoutubePlayer = styled(YouTubePlayer).attrs({
  webViewStyle: Platform.OS === 'android' ? { opacity: 0.99 } : undefined,
})``
