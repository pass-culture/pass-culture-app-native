import React, { ForwardedRef } from 'react'
import YouTubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'

import { PlayerState } from 'features/home/components/modules/video/types'

let mockState = PlayerState.UNSTARTED
let mockError = false

const YouTubePlayerMock = React.forwardRef(function Component(
  props: {
    onReady?: () => void
    onChangeState?: (state: string) => void
    onError?: () => void
  },
  ref: ForwardedRef<YoutubeIframeRef>
) {
  React.useEffect(() => {
    if (props.onReady) props.onReady()
    if (props.onChangeState) props.onChangeState(mockState)
    if (props.onError && mockError) props.onError()
  }, [props])

  if (typeof ref === 'object' && ref !== null) {
    ref.current = {
      getCurrentTime: jest.fn().mockReturnValue(134.9),
      getDuration: jest.fn().mockReturnValue(267.4),
      getVideoUrl: jest.fn(),
      isMuted: jest.fn(),
      getVolume: jest.fn(),
      getPlaybackRate: jest.fn(),
      getAvailablePlaybackRates: jest.fn(),
      seekTo: jest.fn(),
    }
  }

  // @ts-ignore avoid internal typing complexity
  return React.createElement(YouTubePlayer, props)
})

const setPlayerState = (playerState: PlayerState) => {
  mockState = playerState
}

const setError = (error: boolean) => {
  mockError = error
}

const MockedYoutubePlayer = YouTubePlayerMock as typeof YouTubePlayerMock & {
  setPlayerState: (playerState: PlayerState) => void
  setError: (error: boolean) => void
}

MockedYoutubePlayer.setPlayerState = setPlayerState
MockedYoutubePlayer.setError = setError

export default MockedYoutubePlayer
