import { useCallback, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { YoutubeIframeRef } from 'react-native-youtube-iframe'
import YouTube from 'react-youtube'

import { analytics } from 'libs/analytics'

export enum VideoPlayerButtonsWording {
  CONTINUE_PLAYING = 'Continuer à regarder',
  START_PLAYING = 'Lire la vidéo',
  NEXT_VIDEO = 'Voir la vidéo suivante',
  REPLAY_VIDEO = 'Revoir la vidéo',
}

export enum PlayerState {
  UNSTARTED = 'unstarted',
  BUFFERING = 'buffering',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
  CUED = 'video cued',
}

export interface VerticalVideoPlayerProps {
  videoSources: string[]
  playNextVideo: () => void
  currentIndex: number
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  hasFinishedPlaying: boolean
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
}

type Props = {
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
  playerRefCurrent: YoutubeIframeRef | YouTube['internalPlayer'] | null
  currentVideoId?: string
}

export const useVerticalVideoPlayer = ({
  isPlaying,
  setIsPlaying,
  setHasFinishedPlaying,
  moduleId,
  currentVideoId,
  playerRefCurrent,
}: Props) => {
  const [isMuted, setIsMuted] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [showErrorView, setShowErrorView] = useState(false)
  const [videoState, setVideoState] = useState(PlayerState.UNSTARTED)

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

  useEffect(() => {
    const interval = setInterval(async () => {
      if (playerRefCurrent) {
        try {
          const videoDuration = await playerRefCurrent.getDuration()
          const elapsed_sec = await playerRefCurrent.getCurrentTime()
          if (elapsed_sec && videoDuration) setElapsed(elapsed_sec / videoDuration)
        } catch (error) {
          console.error('Error getting video duration or current time:', error)
        }
      }
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [playerRefCurrent])

  const onChangeState = useCallback(
    (state: PlayerState | undefined) => {
      if (state) {
        setVideoState(state)
        setShowErrorView(false)
      }
      switch (state) {
        case undefined:
          throw new Error(' Buffering or cued needs to be handled\u00a0! ')
        case PlayerState.ENDED:
          analytics.logHasSeenAllVideo(moduleId, currentVideoId)
          setHasFinishedPlaying(true)
          setIsPlaying(false)
          break
        case PlayerState.PAUSED:
          setIsPlaying(false)
          break
        case PlayerState.PLAYING:
        case PlayerState.UNSTARTED:
          setIsPlaying(true)
          break
      }
    },
    [setIsPlaying, setHasFinishedPlaying, currentVideoId, moduleId]
  )

  const getVideoDuration = async () => {
    return playerRefCurrent?.getDuration()
  }

  const logPausedVideo = async () => {
    const videoDuration = await getVideoDuration()
    analytics.logVideoPaused({
      videoDuration,
      seenDuration: videoDuration ? elapsed * videoDuration : 0,
      youtubeId: currentVideoId,
    })
  }

  const intersectionObserverListener = (isInView: boolean) => {
    if (!isInView) pauseVideo()
  }

  const toggleMute = () => {
    if ('mute' in playerRefCurrent) {
      isMuted ? playerRefCurrent.unMute() : playerRefCurrent.mute()
    }

    setIsMuted(!isMuted)
  }

  const pauseVideo = () => {
    if ('pauseVideo' in playerRefCurrent) {
      playerRefCurrent.pauseVideo()
    }
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo()
      logPausedVideo()
    } else {
      playVideo()
    }
  }

  const playVideo = () => {
    if ('playVideo' in playerRefCurrent) {
      playerRefCurrent.playVideo()
    }
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  const replayVideo = () => {
    playerRefCurrent?.seekTo(0, false)
    playVideo()
  }

  const toggleErrorView = () => setShowErrorView(true)

  return {
    isMuted,
    toggleMute,
    togglePlay,
    pauseVideo,
    intersectionObserverListener,
    playVideo,
    replayVideo,
    elapsed,
    showErrorView,
    onChangeState,
    toggleErrorView,
    videoState,
  }
}
