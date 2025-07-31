import React, { ForwardedRef } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'

import { PlayerState } from 'features/home/components/modules/video/types'

let mockState = PlayerState.UNSTARTED
let mockError = false
let mockPlayerStateData: number
const YouTubePlayerMock = React.forwardRef(function Component(
  props: YouTubeProps,
  ref: ForwardedRef<YouTube>
) {
  React.useEffect(() => {
    if (props.onReady) props.onReady({ data: mockPlayerStateData, target: jest.fn() })
    if (props.onStateChange) props.onStateChange({ data: mockPlayerStateData, target: jest.fn() })
    if (props.onError && mockError) props.onError({ data: mockPlayerStateData, target: jest.fn() })
  }, [props])

  if (typeof ref === 'object' && ref !== null) {
    ref.current = {
      internalPlayer: {
        getCurrentTime: jest.fn().mockReturnValue(134.9),
        getDuration: jest.fn().mockReturnValue(267.4),
        getVideoUrl: jest.fn(),
        isMuted: jest.fn(),
        getVolume: jest.fn(),
        getPlaybackRate: jest.fn(),
        getAvailablePlaybackRates: jest.fn(),
        seekTo: jest.fn(),
      },
      container: null,
      destroyPlayerPromise: undefined,
      componentDidMount: jest.fn(),
      componentDidUpdate: jest.fn(),
      componentWillUnmount: jest.fn(),
      onPlayerReady: jest.fn(),
      onPlayerError: jest.fn(),
      onPlayerStateChange: jest.fn(),
      onPlayerPlaybackRateChange: jest.fn(),
      onPlayerPlaybackQualityChange: jest.fn(),
      destroyPlayer: jest.fn(),
      createPlayer: jest.fn(),
      resetPlayer: jest.fn(),
      updatePlayer: jest.fn(),
      getInternalPlayer: jest.fn(),
      updateVideo: jest.fn(),
      refContainer: jest.fn(),
      render: jest.fn(),
      context: jest.fn(),
      setState: jest.fn(),
      forceUpdate: jest.fn(),
      state: mockState,
      props,
    }
  }
  // @ts-ignore avoid internal typing complexity
  return React.createElement(YouTube, props)
})

const setPlayerState = (playerState: PlayerState) => {
  mockState = playerState
}

const setError = (error: boolean) => {
  mockError = error
}

const setPlayerStateData = (playerStateData: number) => {
  mockPlayerStateData = playerStateData
}

const MockedYoutubePlayer = YouTubePlayerMock as typeof YouTubePlayerMock & {
  setPlayerState: (playerState: PlayerState) => void
  setPlayerStateData: (playerStateData: number) => void
  setError: (error: boolean) => void
  PlayerState: typeof YouTube.PlayerState
}

MockedYoutubePlayer.setPlayerState = setPlayerState
MockedYoutubePlayer.setError = setError
MockedYoutubePlayer.PlayerState = YouTube.PlayerState
MockedYoutubePlayer.setPlayerStateData = setPlayerStateData

export default MockedYoutubePlayer
