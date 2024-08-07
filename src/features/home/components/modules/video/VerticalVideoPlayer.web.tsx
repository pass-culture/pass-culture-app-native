import colorAlpha from 'color-alpha'
import React, { useRef } from 'react'
// eslint-disable-next-line no-restricted-imports
import { isChrome } from 'react-device-detect'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  cancelAnimation,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO710,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { PlayerState } from 'features/home/components/modules/video/types'
import {
  useVerticalVideoPlayer,
  VerticalVideoPlayerProps,
  VideoPlayerButtonsWording,
} from 'features/home/components/modules/video/useVerticalVideoPlayer'
import { VerticalVideoEndView } from 'features/home/components/modules/video/VerticalVideoEndView'
import { VerticalVideoErrorView } from 'features/home/components/modules/video/VerticalVideoErrorView'
// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb } from 'libs/react-device-detect'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { theme } from 'theme'
import { Pause } from 'ui/svg/icons/Pause'
import { PlayV2 } from 'ui/svg/icons/PlayV2'
import { SoundOff } from 'ui/svg/icons/SoundOff'
import { SoundOn } from 'ui/svg/icons/SoundOn'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const PLAYER_FIXED_WIDTH = 375

const adaptWebPlayerState = (state: number) => {
  switch (state) {
    case 0:
      return PlayerState.ENDED
    case 1:
      return PlayerState.PLAYING
    case 2:
      return PlayerState.PAUSED
    case 3:
      return PlayerState.BUFFERING
    default:
      return PlayerState.UNSTARTED
  }
}

export const VerticalVideoPlayer: React.FC<VerticalVideoPlayerProps> = ({
  videoSources,
  currentIndex,
  playNextVideo,
  isPlaying,
  setIsPlaying,
  hasFinishedPlaying,
  setHasFinishedPlaying,
  moduleId,
  homeEntryId,
}) => {
  const playerRef = useRef<YouTube>(null)
  const playerRefCurrent = playerRef.current?.internalPlayer

  const {
    isMuted,
    toggleMute,
    togglePlay,
    intersectionObserverListener,
    replayVideo,
    videoState,
    showErrorView,
    onChangeState,
    toggleErrorView,
    getVideoDuration,
    getCurrentTime,
  } = useVerticalVideoPlayer({
    playerRefCurrent,
    isPlaying,
    setIsPlaying,
    setHasFinishedPlaying,
    moduleId,
    currentVideoId: videoSources[currentIndex],
    homeEntryId,
  })

  const { isDesktopViewport } = useTheme()
  const { playerHeight } = getVideoPlayerDimensions(isDesktopViewport, PLAYER_FIXED_WIDTH, RATIO710)

  const animValue = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => {
    return {
      width: `${animValue?.value}%`,
    }
  }, [animValue])

  const handleReplayVideo = () => {
    animValue.value = 0
    replayVideo()
  }

  const handleChangeState = async (event: YouTubeEvent) => {
    onChangeState(adaptWebPlayerState(event.data))

    switch (event.data) {
      case YouTube.PlayerState.ENDED:
        animValue.value = 100
        break
      case YouTube.PlayerState.UNSTARTED:
        animValue.value = 0
        break
      case YouTube.PlayerState.PAUSED:
      case YouTube.PlayerState.BUFFERING:
        cancelAnimation(animValue)
        break
      case YouTube.PlayerState.PLAYING:
        {
          const [currentTime, videoDuration] = await Promise.all([
            getCurrentTime(),
            getVideoDuration(),
          ])
          if (videoDuration && currentTime) {
            animValue.value = (currentTime / videoDuration) * 100
            animValue.value = withTiming(100, {
              duration: (videoDuration - currentTime) * 1000,
              easing: Easing.linear,
            })
          }
        }
        break
      default:
        break
    }
  }

  // remove the fullscreen video for Chrome - mobile as
  // the dimensions are not appropriated and not working
  const isFullscreenEnabled = !(isChrome && isMobileDeviceDetectOnWeb)

  const opts: YouTubeProps['opts'] = {
    width: PLAYER_FIXED_WIDTH,
    height: playerHeight,
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: true,
      rel: false,
      fs: isFullscreenEnabled,
      showClosedCaptions: false,
      color: 'white',
    },
  }

  const PlayerCalque = () => {
    if (hasFinishedPlaying) {
      return (
        <VerticalVideoEndView
          style={{ height: playerHeight, width: PLAYER_FIXED_WIDTH }}
          onPressReplay={handleReplayVideo}
          onPressNext={playNextVideo}
          hasMultipleSources={videoSources.length > 1}
        />
      )
    }
    return (
      <PressListener onPress={togglePlay}>
        <Calque
          style={{ height: playerHeight, width: PLAYER_FIXED_WIDTH }}
          colors={[colorAlpha(theme.colors.black, 0.9), colorAlpha(theme.colors.black, 0.9)]}>
          <ButtonsContainer>
            <IconContainer>
              <StyledPlayIcon />
            </IconContainer>
            <Spacer.Column numberOfSpaces={1.5} />
            <StyledCaption>
              {videoState === PlayerState.UNSTARTED
                ? VideoPlayerButtonsWording.START_PLAYING
                : VideoPlayerButtonsWording.CONTINUE_PLAYING}
            </StyledCaption>
          </ButtonsContainer>
        </Calque>
      </PressListener>
    )
  }

  const playVideo = (event: YouTubeEvent) => {
    event.target.mute()
    event.target.playVideo()
  }

  return (
    <IntersectionObserver
      onChange={(inView) => intersectionObserverListener(inView)}
      key={`verticalVideoPlayerWeb-${moduleId}`}>
      <StyledVideoPlayerContainer style={{ height: playerHeight, width: PLAYER_FIXED_WIDTH }}>
        <YouTube
          ref={playerRef}
          videoId={videoSources[currentIndex]}
          opts={opts}
          onReady={playVideo}
          onStateChange={handleChangeState}
          onError={toggleErrorView}
        />
      </StyledVideoPlayerContainer>

      {isPlaying ? (
        <PressListener style={{ height: playerHeight }} onPress={togglePlay} />
      ) : (
        <PlayerCalque />
      )}

      {isPlaying ? (
        <StyledProgressContainer>
          <ControlsContainer>
            <ButtonWithCaption
              onPress={togglePlay}
              icon={StyledPauseIcon}
              wording=""
              accessibilityLabel="Mettre en pause la vidéo"
            />
            <ButtonWithCaption
              onPress={toggleMute}
              icon={isMuted ? StyledMutedIcon : StyledUnmutedIcon}
              wording=""
              accessibilityLabel="Activer ou désactiver le son"
            />
          </ControlsContainer>
          <ProgressBarWrapper>
            <ProgressBar style={animStyle} />
          </ProgressBarWrapper>
        </StyledProgressContainer>
      ) : null}

      {showErrorView ? (
        <VerticalVideoErrorView style={{ height: playerHeight, width: PLAYER_FIXED_WIDTH }} />
      ) : null}
    </IntersectionObserver>
  )
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient)

const ProgressBarWrapper = styled.View({
  backgroundColor: theme.colors.white,
})

const ProgressBar = styled(AnimatedGradient).attrs(({ theme }) => ({
  colors: [theme.colors.primary, theme.colors.secondary],
  angle: 90,
  useAngle: true,
}))({
  height: getSpacing(1),
  borderRadius: getSpacing(12),
})

const StyledVideoPlayerContainer = styled.View(({ theme }) => ({
  borderRadius: getSpacing(1),
  overflow: 'hidden',
  backgroundColor: theme.colors.black,
}))

const Calque = styled(LinearGradient)({
  position: 'absolute',
  left: getSpacing(6),
  right: getSpacing(6),
  top: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: getSpacing(1),
  overflow: 'hidden',
})

const PressListener = styled.Pressable({
  position: 'absolute',
  left: -getSpacing(6),
  right: -getSpacing(6),
  top: 0,
  flexDirection: 'row',
})

const ButtonsContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: getSpacing(20),
})

const ControlsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: getSpacing(2),
})

const StyledPlayIcon = styled(PlayV2).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.standard,
}))``

const StyledUnmutedIcon = styled(SoundOn).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledPauseIcon = styled(Pause).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledMutedIcon = styled(SoundOff).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``

const StyledProgressContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const IconContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.colors.white,
}))
