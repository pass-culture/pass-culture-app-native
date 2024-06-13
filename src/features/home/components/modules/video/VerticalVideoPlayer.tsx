import colorAlpha from 'color-alpha'
import React, { useCallback, useState } from 'react'
import { useWindowDimensions, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import YouTubePlayer from 'react-native-youtube-iframe'
import styled, { useTheme } from 'styled-components/native'

import {
  getVideoPlayerDimensions,
  RATIO710,
} from 'features/home/components/helpers/getVideoPlayerDimensions'
import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { useVerticalVideoPlayer } from 'features/home/components/modules/video/useVerticalVideoPlayer'
import { VerticalVideoEndView } from 'features/home/components/modules/video/VerticalVideoEndView'
import { VerticalVideoErrorView } from 'features/home/components/modules/video/VerticalVideoErrorView'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { theme } from 'theme'
import { PlayV2 } from 'ui/svg/icons/PlayV2'
import { SoundOff } from 'ui/svg/icons/SoundOff'
import { SoundOn } from 'ui/svg/icons/SoundOn'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const PLAYER_CONTROLS_HEIGHT = getSpacing(0)

export enum VideoPlayerButtonsWording {
  CONTINUE_PLAYING = 'Continuer à regarder',
  START_PLAYING = 'Lire la vidéo',
  NEXT_VIDEO = 'Voir la vidéo suivante',
  REPLAY_VIDEO = 'Revoir la vidéo',
}

enum PlayerState {
  UNSTARTED = 'unstarted',
  BUFFERING = 'buffering',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
}

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

  const {
    isMuted,
    toggleMute,
    togglePlay,
    intersectionObserverListener,
    pauseVideo,
    playVideo,
    replayVideo,
    playerRef,
    elapsed,
  } = useVerticalVideoPlayer({
    isPlaying,
    setIsPlaying,
    setHasFinishedPlaying,
  })

  const { isDesktopViewport } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO710
  )

  const onChangeState = useCallback(
    (state: string) => {
      setShowErrorView(false)
      if (state === PlayerState.ENDED) {
        setHasFinishedPlaying(true)
        setIsPlaying(false)
      } else if (state === PlayerState.PAUSED) {
        setIsPlaying(false)
      } else if (state === PlayerState.PLAYING) {
        setIsPlaying(true)
      } else if (state === PlayerState.UNSTARTED) {
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
            <IconContainer>
              <StyledPlayIcon />
            </IconContainer>
            <Spacer.Column numberOfSpaces={1.5} />
            <StyledCaption>{VideoPlayerButtonsWording.CONTINUE_PLAYING}</StyledCaption>
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

const StyledPauseIcon = styled(PlayV2).attrs(({ theme }) => ({
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

// The app crashed when the youtube player is used with react-navigation. This fixes the issue (source: https://lonelycpp.github.io/react-native-youtube-iframe/navigation-crash/#2-tweak-webview-props)
const StyledYoutubePlayer = styled(YouTubePlayer).attrs({
  webViewStyle: Platform.OS === 'android' ? { opacity: 0.99 } : undefined,
})``

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const IconContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.colors.white,
}))
