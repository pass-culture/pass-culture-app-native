import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { YoutubeIframeRef } from 'react-native-youtube-iframe'

import { analytics } from 'libs/analytics'

export enum PlayerState {
  UNSTARTED = 'unstarted',
  BUFFERING = 'buffering',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
}

type Props = {
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
  homeEntryId: string
  currentVideoId?: string
}

export const useVerticalVideoPlayer = ({
  isPlaying,
  setIsPlaying,
  setHasFinishedPlaying,
  moduleId,
  homeEntryId,
  currentVideoId,
}: Props) => {
  const [isMuted, setIsMuted] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [showErrorView, setShowErrorView] = useState(false)
  const [videoState, setVideoState] = useState(PlayerState.UNSTARTED)
  const verticalPlayerRef = useRef<YoutubeIframeRef>(null)

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
    const interval = setInterval(async () => {
      const videoDuration = await getVideoDuration()
      const elapsed_sec = await verticalPlayerRef.current?.getCurrentTime()
      if (elapsed_sec && videoDuration) setElapsed(elapsed_sec / videoDuration)
    }, 100)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeState = useCallback(
    (state: string) => {
      setVideoState(state as PlayerState)
      setShowErrorView(false)
      if (state === PlayerState.ENDED) {
        analytics.logHasSeenAllVideo(moduleId, currentVideoId)
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
    [setIsPlaying, setHasFinishedPlaying, currentVideoId, moduleId]
  )

  const getVideoDuration = async () => {
    return verticalPlayerRef.current?.getDuration()
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
    setIsMuted(!isMuted)
  }

  const pauseVideo = () => {
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (videoState === PlayerState.UNSTARTED && !isPlaying) {
      analytics.logConsultVideo({
        from: 'video_carousel_block',
        moduleId,
        homeEntryId,
        youtubeId: currentVideoId,
      })
    }
    if (isPlaying) {
      pauseVideo()
      logPausedVideo()
    } else {
      setIsPlaying(true)
    }
  }

  const playVideo = () => {
    if (videoState === PlayerState.UNSTARTED) {
      analytics.logConsultVideo({
        from: 'video_carousel_block',
        moduleId,
        homeEntryId,
        youtubeId: currentVideoId,
      })
    }
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  const replayVideo = () => {
    verticalPlayerRef.current?.seekTo(0, false)
    setHasFinishedPlaying(false)
    setIsPlaying(true)
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
    playerRef: verticalPlayerRef,
    elapsed,
    showErrorView,
    onChangeState,
    toggleErrorView,
    videoState,
  }
}
