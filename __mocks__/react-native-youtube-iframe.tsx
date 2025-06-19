import React from 'react'
import WebView from 'react-native-webview'
import { PLAYER_STATES } from 'react-native-youtube-iframe'

export { PLAYER_STATES } from 'react-native-youtube-iframe'

let mockState = PLAYER_STATES.UNSTARTED
let mockError = false

const YouTubePlayerMock = React.forwardRef(function Component(
  props: {
    onReady?: () => void
    onChangeState?: (state: string) => void
    onError?: () => void
  },
  ref
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

  return <WebView {...props} />
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
