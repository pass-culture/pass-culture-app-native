import colorAlpha from 'color-alpha'
import React from 'react'
import { Platform, useWindowDimensions, View } from 'react-native'
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
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Pause } from 'ui/svg/icons/Pause'
import { PlayV2 } from 'ui/svg/icons/PlayV2'
import { SoundOff } from 'ui/svg/icons/SoundOff'
import { SoundOn } from 'ui/svg/icons/SoundOn'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { PlayerState } from './types'

const PLAYER_CONTROLS_HEIGHT = getSpacing(0)

export enum VideoPlayerButtonsWording {
  CONTINUE_PLAYING = 'Continuer à regarder',
  START_PLAYING = 'Lire la vidéo',
  NEXT_VIDEO = 'Voir la vidéo suivante',
  REPLAY_VIDEO = 'Revoir la vidéo',
}

export interface VideoPlayerProps {
  videoSources: string[]
  playNextVideo: () => void
  currentIndex: number
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  hasFinishedPlaying: boolean
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
  homeEntryId: string
}

export const VerticalVideoPlayer: React.FC<VideoPlayerProps> = ({
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
  const {
    isMuted,
    toggleMute,
    togglePlay,
    intersectionObserverListener,
    pauseVideo,
    playVideo,
    replayVideo,
    playerRef,
    onChangeState,
    showErrorView,
    toggleErrorView,
    videoState,
  } = useVerticalVideoPlayer({
    isPlaying,
    setIsPlaying,
    setHasFinishedPlaying,
    moduleId,
    currentVideoId: videoSources[currentIndex],
    homeEntryId,
  })

  const { isDesktopViewport, designSystem } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const { playerHeight, playerWidth } = getVideoPlayerDimensions(
    isDesktopViewport,
    windowWidth,
    RATIO710
  )

  const handleReplayVideo = () => {
    replayVideo()
  }

  const handleChangeState = async (event: string) => {
    onChangeState(event)
  }

  const PlayerCalque = () => {
    const { designSystem } = useTheme()

    if (hasFinishedPlaying) {
      return (
        <VerticalVideoEndView
          style={{ height: playerHeight, width: windowWidth }}
          onPressReplay={handleReplayVideo}
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
          colors={[
            colorAlpha(designSystem.color.background.lockedInverted, 0.9),
            colorAlpha(designSystem.color.background.lockedInverted, 0.9),
          ]}>
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
    <IntersectionObserver
      onChange={(inView) => intersectionObserverListener(inView)}
      key="verticalVideoPlayer">
      <StyledVideoPlayerContainer style={{ height: playerHeight }}>
        <StyledYoutubePlayer
          ref={playerRef}
          initialPlayerParams={{
            modestbranding: true,
            color: designSystem.color.icon.lockedInverted,
            showClosedCaptions: false,
            controls: false,
          }}
          height={playerHeight}
          width={playerWidth}
          play={isPlaying}
          onReady={isPlaying ? playVideo : pauseVideo}
          onError={toggleErrorView}
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
          onChangeState={handleChangeState}
        />
      </StyledVideoPlayerContainer>

      {isPlaying ? (
        <PressListener
          style={{ height: playerHeight - PLAYER_CONTROLS_HEIGHT }}
          onPress={togglePlay}
        />
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
            <ProgressBar />
          </ProgressBarWrapper>
        </StyledProgressContainer>
      ) : null}

      {showErrorView ? (
        <VerticalVideoErrorView style={{ height: playerHeight, width: playerWidth }} />
      ) : null}
    </IntersectionObserver>
  )
}

const ProgressBarWrapper = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.locked,
}))

const ProgressBar = styled(View).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    theme.designSystem.color.background.brandPrimary,
    theme.designSystem.color.background.brandPrimary,
  ],
  angle: 90,
  useAngle: true,
}))({
  height: getSpacing(1),
  borderRadius: getSpacing(12),
})

const StyledVideoPlayerContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  alignSelf: 'stretch',
}))

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

const ControlsContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: theme.designSystem.size.spacing.s,
}))

const StyledPlayIcon = styled(PlayV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.locked,
  size: theme.icons.sizes.standard,
}))``

const StyledUnmutedIcon = styled(SoundOn).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.locked,
  size: theme.icons.sizes.small,
}))``

const StyledPauseIcon = styled(Pause).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.locked,
  size: theme.icons.sizes.small,
}))``

const StyledMutedIcon = styled(SoundOff).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.locked,
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

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))

const IconContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
  padding: getSpacing(2.5),
  backgroundColor: theme.designSystem.color.background.locked,
}))
