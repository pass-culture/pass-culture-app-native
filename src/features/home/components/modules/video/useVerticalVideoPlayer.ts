import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { YoutubeIframeRef } from 'react-native-youtube-iframe'

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
}

export const useVerticalVideoPlayer = ({
  isPlaying,
  setIsPlaying,
  setHasFinishedPlaying,
}: Props) => {
  const [isMuted, setIsMuted] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [showErrorView, setShowErrorView] = useState(false)
  const [videoState, setVideoState] = useState(PlayerState.UNSTARTED)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeState = useCallback(
    (state: string) => {
      setVideoState(state as PlayerState)
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
    setIsPlaying(!isPlaying)
  }

  const playVideo = () => {
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  const replayVideo = () => {
    playerRef.current?.seekTo(0, false)
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
    playerRef,
    elapsed,
    showErrorView,
    onChangeState,
    toggleErrorView,
    videoState,
  }
}
