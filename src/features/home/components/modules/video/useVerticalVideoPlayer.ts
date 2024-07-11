import { useCallback, useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import { YoutubeIframeRef } from 'react-native-youtube-iframe'
import YouTube from 'react-youtube'

import { analytics } from 'libs/analytics'

export enum VideoPlayerButtonsWording {
  CONTINUE_PLAYING = 'Continuer à regarder',
  START_PLAYING = 'Lire la vidéo',
  NEXT_VIDEO = 'Voir la vidéo suivante',
  REPLAY_VIDEO = 'Revoir la vidéo',
}

import { PlayerState } from './types'

export interface VerticalVideoPlayerProps {
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

type Props = {
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
  playerRefCurrent: YoutubeIframeRef | YouTube['internalPlayer'] | null
  currentVideoId?: string
  homeEntryId: string
}

export const useVerticalVideoPlayer = ({
  isPlaying,
  setIsPlaying,
  setHasFinishedPlaying,
  moduleId,
  currentVideoId,
  playerRefCurrent,
  homeEntryId,
}: Props) => {
  const [isMuted, setIsMuted] = useState(true)
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

  const onChangeState = useCallback(
    (state: string) => {
      setVideoState(state as PlayerState)
      setShowErrorView(false)
      if (state === PlayerState.ENDED) {
        const analyticsAllVideo = { moduleId, youtubeId: currentVideoId }
        analytics.logHasSeenAllVideo(analyticsAllVideo)
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
    [currentVideoId, moduleId, setHasFinishedPlaying, setIsPlaying]
  )

  const getVideoDuration = useCallback(async () => {
    return playerRefCurrent?.getDuration()
  }, [])

  const getCurrentTime = useCallback(async () => {
    return playerRefCurrent?.getCurrentTime()
  }, [])

  const logPausedVideo = async () => {
    const [currentTime = 0, videoDuration = 0] = await Promise.all([
      playerRefCurrent?.getCurrentTime(),
      playerRefCurrent?.getDuration(),
    ])

    analytics.logVideoPaused({
      videoDuration: videoDuration ? Math.round(videoDuration) : 0,
      seenDuration: videoDuration ? Math.round(currentTime) : 0,
      youtubeId: currentVideoId,
      homeEntryId,
      moduleId,
    })
  }

  const intersectionObserverListener = (isInView: boolean) => {
    if (!isInView) pauseVideo()
  }

  const toggleMute = () => {
    switch (true) {
      case Platform.OS === 'web':
        if (playerRefCurrent ?? 'mute' in playerRefCurrent) {
          if (isMuted) {
            playerRefCurrent.unMute()
          } else {
            playerRefCurrent.mute()
          }
        }
        setIsMuted(!isMuted)
        break
      case Platform.OS !== 'web':
        setIsMuted(!isMuted)
        break
      default:
        break
    }
  }

  const pauseVideo = () => {
    switch (true) {
      case Platform.OS === 'web':
        if (playerRefCurrent ?? 'pauseVideo' in playerRefCurrent) {
          playerRefCurrent.pauseVideo()
          setIsPlaying(false)
          logPausedVideo()
        }
        break
      case Platform.OS !== 'web':
        setIsPlaying(false)
        logPausedVideo()
        break
      default:
        break
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo()
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

  useEffect(() => {
    if (!isPlaying) {
      pauseVideo()
    }
  }, [isPlaying, pauseVideo])

  return {
    isMuted,
    toggleMute,
    togglePlay,
    pauseVideo,
    intersectionObserverListener,
    playVideo,
    replayVideo,
    showErrorView,
    onChangeState,
    toggleErrorView,
    videoState,
    getVideoDuration,
    getCurrentTime,
  }
}
