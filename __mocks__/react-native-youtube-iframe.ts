import React, { ForwardedRef } from 'react'
import YouTubePlayer, { PLAYER_STATES, YoutubeIframeRef } from 'react-native-youtube-iframe'

let mockState = PLAYER_STATES.UNSTARTED
let mockError = false

const YouTubePlayerMock = React.forwardRef(function Component(
  props: {
    onReady?: () => void
    onChangeState?: (state: string) => void
    onError?: () => void
  },
  ref: ForwardedRef<Partial<YoutubeIframeRef>>
) {
  React.useEffect(() => {
    if (props.onReady) props.onReady()
    if (props.onChangeState) props.onChangeState(mockState)
    if (props.onError && mockError) props.onError()
  }, [props])

  // @ts-ignore avoid internal typing complexity
  return React.createElement(YouTubePlayer, { ref, ...props })
})

const setPlayerState = (playerState: PLAYER_STATES) => {
  mockState = playerState
}

const setError = (error: boolean) => {
  mockError = error
}

const MockedYoutubePlayer = YouTubePlayerMock as typeof YouTubePlayerMock & {
  setPlayerState: (playerState: PLAYER_STATES) => void
  setError: (error: boolean) => void
}

MockedYoutubePlayer.setPlayerState = setPlayerState
MockedYoutubePlayer.setError = setError

export default MockedYoutubePlayer
export { PLAYER_STATES }
