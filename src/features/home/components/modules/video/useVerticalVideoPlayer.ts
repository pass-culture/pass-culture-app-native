import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { YoutubeIframeRef } from 'react-native-youtube-iframe'

import { analytics } from 'libs/analytics'

import { PlayerState } from './types'

type Props = {
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setHasFinishedPlaying: React.Dispatch<React.SetStateAction<boolean>>
  moduleId: string
  currentVideoId?: string
  homeEntryId: string
}

export const useVerticalVideoPlayer = ({
  isPlaying,
  setIsPlaying,
  setHasFinishedPlaying,
  moduleId,
  currentVideoId,
  homeEntryId,
}: Props) => {
  const [isMuted, setIsMuted] = useState(true)
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

  const logPausedVideo = useCallback(async () => {
    const [currentTime = 0, videoDuration = 0] = await Promise.all([
      verticalPlayerRef.current?.getCurrentTime(),
      verticalPlayerRef.current?.getDuration(),
    ])

    analytics.logVideoPaused({
      videoDuration: videoDuration ? Math.round(videoDuration) : 0,
      seenDuration: videoDuration ? Math.round(currentTime) : 0,
      youtubeId: currentVideoId,
      homeEntryId,
      moduleId,
    })
  }, [currentVideoId, moduleId, homeEntryId])

  const pauseVideo = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      logPausedVideo()
    }
  }, [isPlaying, logPausedVideo, setIsPlaying])

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
        pauseVideo()
      } else if (state === PlayerState.PLAYING) {
        setIsPlaying(true)
      } else if (state === PlayerState.UNSTARTED) {
        setIsPlaying(true)
      }
    },
    [currentVideoId, moduleId, setHasFinishedPlaying, setIsPlaying, pauseVideo]
  )

  const getVideoDuration = useCallback(async () => {
    return verticalPlayerRef.current?.getDuration()
  }, [])

  const getCurrentTime = useCallback(async () => {
    return verticalPlayerRef.current?.getCurrentTime()
  }, [])

  const intersectionObserverListener = (isInView: boolean) => {
    if (!isInView) pauseVideo()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlay = () => {
    isPlaying ? pauseVideo() : setIsPlaying(true)
  }

  const playVideo = () => {
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
    showErrorView,
    onChangeState,
    toggleErrorView,
    videoState,
    getVideoDuration,
    getCurrentTime,
  }
}
