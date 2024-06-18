import React from 'react'
import YouTubePlayer from 'react-native-youtube-iframe'

import { PlayerState } from 'features/home/components/modules/video/useVerticalVideoPlayer'

let mockState = PlayerState.UNSTARTED
let mockError = false

const YouTubePlayerMock = React.forwardRef(function Component(
  props: {
    onReady?: () => void
    onChangeState?: (state: string) => void
    onError?: () => void
  },
  ref: unknown
) {
  React.useEffect(() => {
    if (props.onReady) props.onReady()
    if (props.onChangeState) props.onChangeState(mockState)
    if (props.onError && mockError) props.onError()
  }, [props])

  // @ts-ignore avoid internal typing complexity
  return React.createElement(YouTubePlayer, { ref, ...props })
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
