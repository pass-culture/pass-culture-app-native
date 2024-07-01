import colorAlpha from 'color-alpha'
import React, { useRef } from 'react'
// eslint-disable-next-line no-restricted-imports
import { isChrome } from 'react-device-detect'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import YouTube, { YouTubeProps } from 'react-youtube'
import styled from 'styled-components/native'

import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import {
  PlayerState,
  useVerticalVideoPlayer,
  VerticalVideoPlayerProps,
  VideoPlayerButtonsWording,
} from 'features/home/components/modules/video/useVerticalVideoPlayer'
import { VerticalVideoEndView } from 'features/home/components/modules/video/VerticalVideoEndView'
import { VideoErrorView } from 'features/home/components/modules/video/VideoErrorView'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb } from 'libs/react-device-detect'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { theme } from 'theme'
import { Pause } from 'ui/svg/icons/Pause'
import { PlayV2 } from 'ui/svg/icons/PlayV2'
import { SoundOff } from 'ui/svg/icons/SoundOff'
import { SoundOn } from 'ui/svg/icons/SoundOn'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const RATIO = 7 / 10
const PLAYER_FIXED_WIDTH = 375
const PLAYER_FIXED_HEIGHT = PLAYER_FIXED_WIDTH / RATIO

const translatePlateformState = (
  newWebPlayerState: (typeof YouTube.PlayerState)[keyof typeof YouTube.PlayerState]
): PlayerState | undefined => {
  switch (newWebPlayerState) {
    case YouTube.PlayerState.UNSTARTED:
      return PlayerState.UNSTARTED
    case YouTube.PlayerState.ENDED:
      return PlayerState.ENDED
    case YouTube.PlayerState.PLAYING:
      return PlayerState.PLAYING
    case YouTube.PlayerState.PAUSED:
      return PlayerState.PAUSED
    case YouTube.PlayerState.BUFFERING:
    case YouTube.PlayerState.CUED:
    default:
      return undefined
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
}) => {
  const playerRef = useRef<YouTube>(null)
  const playerRefCurrent = playerRef.current?.internalPlayer

  const {
    isMuted,
    toggleMute,
    togglePlay,
    intersectionObserverListener,
    pauseVideo,
    playVideo,
    replayVideo,
    videoState,
    elapsed,
    showErrorView,
    onChangeState,
    toggleErrorView,
  } = useVerticalVideoPlayer({
    playerRefCurrent,
    isPlaying,
    setIsPlaying,
    setHasFinishedPlaying,
    moduleId,
    currentVideoId: videoSources[currentIndex],
    homeEntryId,
  })

  // remove the fullscreen video for Chrome - mobile as
  // the dimensions are not appropriated and not working
  const isFullscreenEnabled = !(isChrome && isMobileDeviceDetectOnWeb)

  const opts: YouTubeProps['opts'] = {
    width: PLAYER_FIXED_WIDTH,
    height: PLAYER_FIXED_HEIGHT,
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
          style={{ height: PLAYER_FIXED_HEIGHT, width: PLAYER_FIXED_WIDTH }}
          onPressReplay={replayVideo}
          onPressNext={playNextVideo}
          hasMultipleSources={videoSources.length > 1}
        />
      )
    }
    return (
      <PressListener onPress={togglePlay}>
        <Calque
          style={{ height: PLAYER_FIXED_HEIGHT, width: PLAYER_FIXED_WIDTH }}
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

  return (
    <View>
      <IntersectionObserver
        onChange={(inView) => intersectionObserverListener(inView)}
        key="verticalVideoPlayerWeb">
        <StyledVideoPlayerContainer
          style={{ height: PLAYER_FIXED_HEIGHT, width: PLAYER_FIXED_WIDTH }}>
          <YouTube
            ref={playerRef}
            videoId={videoSources[currentIndex]}
            opts={opts}
            onReady={isPlaying ? playVideo : pauseVideo}
            onStateChange={(state) => onChangeState(translatePlateformState(state.data))}
            onError={toggleErrorView}
          />
        </StyledVideoPlayerContainer>

        {isPlaying ? (
          <PressListener style={{ height: PLAYER_FIXED_HEIGHT }} onPress={togglePlay} />
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
            <CreditProgressBar progress={elapsed} height="smaller" />
          </StyledProgressContainer>
        ) : null}

        {showErrorView ? (
          <VideoErrorView style={{ height: PLAYER_FIXED_HEIGHT, width: PLAYER_FIXED_WIDTH }} />
        ) : null}
      </IntersectionObserver>
    </View>
  )
}

const StyledVideoPlayerContainer = styled.View({
  borderRadius: getSpacing(1),
  overflow: 'hidden',
})

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
