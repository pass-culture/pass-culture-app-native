import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import YouTube from 'react-youtube'

import {
  YoutubeRendererProps,
  YoutubeRendererRef,
} from 'features/home/components/modules/video/YoutubePlayer/types'

import { PLAYER_ERROR, PLAYER_STATES } from './constants'

export const YoutubeRenderer = forwardRef<YoutubeRendererRef, YoutubeRendererProps>(
  function YoutubeRenderer(
    { onReady, videoId, height, width, initialPlayerParams, onError, onChangeState },
    ref
  ) {
    const videoRef = useRef<YouTube>(null)

    useImperativeHandle(ref, () => {
      const internalPlayer = videoRef.current?.getInternalPlayer()
      return {
        getDuration: () => Promise.resolve(internalPlayer?.getDuration() ?? 0),
        getVideoUrl: () => Promise.resolve(internalPlayer?.getVideoUrl() ?? ''),
        getCurrentTime: () => Promise.resolve(internalPlayer?.getCurrentTime() ?? 0),
        isMuted: () => Promise.resolve(internalPlayer?.isMuted() ?? false),
        getVolume: () => Promise.resolve(internalPlayer?.getVolume() ?? 0),
        getPlaybackRate: () => Promise.resolve(internalPlayer?.getPlaybackRate() ?? 1),
        getAvailablePlaybackRates: () =>
          Promise.resolve(internalPlayer?.getAvailablePlaybackRates() ?? []),
        seekTo: (seconds: number, allowSeekAhead: boolean) =>
          internalPlayer.seekTo(seconds, allowSeekAhead),
      }
    })

    const handleError = (event: { data: number }) => {
      const errorCode = PLAYER_ERROR[event.data]
      if (errorCode && onError) {
        onError(errorCode)
      }
    }

    const handleChangeState = (event: { data: number }) => {
      const state = PLAYER_STATES[event.data]
      if (state && onChangeState) {
        onChangeState(state)
      }
    }

    return (
      <YouTube
        ref={videoRef}
        videoId={videoId}
        onReady={onReady}
        onError={handleError}
        onStateChange={handleChangeState}
        opts={{ width: width ?? '100%', height, playerVars: initialPlayerParams }}
      />
    )
  }
)
