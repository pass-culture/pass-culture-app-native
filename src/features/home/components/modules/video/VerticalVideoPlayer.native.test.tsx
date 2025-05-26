import React from 'react'
import { PLAYER_STATES } from 'react-native-youtube-iframe'

import MockedYouTubePlayer from '__mocks__/react-native-youtube-iframe'
import {
  VerticalVideoPlayer,
  VideoPlayerButtonsWording,
  VideoPlayerProps,
} from 'features/home/components/modules/video/VerticalVideoPlayer'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/home/components/modules/video/useVerticalVideoPlayer', () => {
  return {
    useVerticalVideoPlayer: (params: unknown) => ({
      ...jest
        .requireActual('features/home/components/modules/video/useVerticalVideoPlayer')
        .useVerticalVideoPlayer(params),
      getVideoDuration: () => Promise.resolve(300),
      getCurrentTime: () => Promise.resolve(30),
    }),
  }
})

const defaultVerticalVideoPlayerProps = {
  videoSources: [''],
  playNextVideo: jest.fn(),
  currentIndex: 0,
  isPlaying: false,
  setIsPlaying: jest.fn(),
  hasFinishedPlaying: false,
  setHasFinishedPlaying: jest.fn(),
  homeEntryId: '',
  moduleId: '',
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('VerticalVideoPlayer', () => {
  beforeEach(() => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.UNSTARTED)
    MockedYouTubePlayer.setError(false)
  })

  it('should render error view when youtube player has an error', async () => {
    MockedYouTubePlayer.setError(true)

    renderVideoPlayer(defaultVerticalVideoPlayerProps)

    expect(
      await screen.findByText('Une erreur s’est produite pendant le chargement de la vidéo')
    ).toBeOnTheScreen()
  })

  it('should not render error view without error', async () => {
    renderVideoPlayer(defaultVerticalVideoPlayerProps)

    const errorMessage = screen.queryByText(
      'Une erreur s’est produite pendant le chargement de la vidéo'
    )

    expect(errorMessage).not.toBeOnTheScreen()
  })

  describe('the video is finished', () => {
    beforeEach(() => {
      MockedYouTubePlayer.setPlayerState(PLAYER_STATES.ENDED)
    })

    it('should display `replay button`', async () => {
      const mockSetIsPlaying = jest.fn()

      renderVideoPlayer({
        ...defaultVerticalVideoPlayerProps,
        setIsPlaying: mockSetIsPlaying,
        hasFinishedPlaying: true,
        videoSources: ['abc'],
      })

      const replayButton = await screen.findByRole(AccessibilityRole.BUTTON, {
        name: VideoPlayerButtonsWording.REPLAY_VIDEO,
      })

      expect(replayButton).toBeOnTheScreen()

      await user.press(replayButton)

      expect(mockSetIsPlaying).toHaveBeenCalledWith(true)
    })

    it('should not display `next video button` when only one video source is provided', async () => {
      renderVideoPlayer({
        ...defaultVerticalVideoPlayerProps,
        hasFinishedPlaying: true,
        videoSources: ['abc'],
      })

      await screen.findByRole(AccessibilityRole.BUTTON, {
        name: VideoPlayerButtonsWording.REPLAY_VIDEO,
      })

      expect(
        screen.queryByRole(AccessibilityRole.BUTTON, {
          name: VideoPlayerButtonsWording.NEXT_VIDEO,
        })
      ).not.toBeOnTheScreen()
    })

    it('should display `replay button` and `next video button` when multiple video sources are provided', async () => {
      renderVideoPlayer({
        ...defaultVerticalVideoPlayerProps,
        hasFinishedPlaying: true,
        videoSources: ['abc', 'def'],
      })

      await screen.findByRole(AccessibilityRole.BUTTON, {
        name: VideoPlayerButtonsWording.REPLAY_VIDEO,
      })

      expect(
        await screen.findByRole(AccessibilityRole.BUTTON, {
          name: VideoPlayerButtonsWording.NEXT_VIDEO,
        })
      ).toBeOnTheScreen()
    })
  })

  it('should display `play video` when video has not started', async () => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.UNSTARTED)

    renderVideoPlayer(defaultVerticalVideoPlayerProps)

    expect(await screen.findByText(VideoPlayerButtonsWording.START_PLAYING)).toBeOnTheScreen()
  })

  it('should display `pause button` and `sound button` when video is playing', async () => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.PLAYING)

    renderVideoPlayer({ ...defaultVerticalVideoPlayerProps, isPlaying: true })

    await screen.findByRole(AccessibilityRole.BUTTON, {
      name: 'Mettre en pause la vidéo',
    })

    expect(
      await screen.findByRole(AccessibilityRole.BUTTON, {
        name: 'Activer ou désactiver le son',
      })
    ).toBeOnTheScreen()
  })

  it('should display `keep watching` when video is paused', async () => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.PAUSED)

    renderVideoPlayer(defaultVerticalVideoPlayerProps)

    expect(await screen.findByText(VideoPlayerButtonsWording.CONTINUE_PLAYING)).toBeOnTheScreen()
  })
})

const renderVideoPlayer = (props: VideoPlayerProps) => {
  render(<VerticalVideoPlayer {...props} />)
}
