import React from 'react'
import { PLAYER_STATES } from 'react-native-youtube-iframe'

import MockedYouTubePlayer from '__mocks__/react-native-youtube-iframe'
import { VideoPlayer } from 'features/home/components/modules/video/VideoPlayer'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockOffer = mockedAlgoliaResponse.hits[0]
const hideModalMock = jest.fn()

const showErrorUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

const mockRef = {
  current: {
    getCurrentTime: jest.fn(),
    getDuration: jest.fn(),
    getVideoUrl: jest.fn(),
    isMuted: jest.fn(),
    getVolume: jest.fn(),
    getPlaybackRate: jest.fn(),
    getAvailablePlaybackRates: jest.fn(),
    seekTo: jest.fn(),
  },
}

const showError: unknown = true
const hideError: unknown = false
jest.mock('libs/firebase/analytics/analytics')

describe('VideoPlayer', () => {
  it('should render error view when showErrorView is true', async () => {
    mockUseState.mockImplementationOnce(() => showErrorUseState(showError))
    mockUseState.mockImplementationOnce(() => showErrorUseState(showError))

    renderVideoPlayer()

    const errorMessage = screen.queryByText(
      'Une erreur s’est produite pendant le chargement de la vidéo.'
    )

    expect(errorMessage).toBeOnTheScreen()
  })

  it('should not render error view when showErrorView is false', async () => {
    mockUseState.mockImplementationOnce(() => showErrorUseState(hideError))
    mockUseState.mockImplementationOnce(() => showErrorUseState(hideError))

    renderVideoPlayer()

    const errorMessage = screen.queryByText(
      'Une erreur s’est produite pendant le chargement de la vidéo.'
    )

    expect(errorMessage).not.toBeOnTheScreen()
  })

  it('should not have replay button visible after clicked', async () => {
    MockedYouTubePlayer.setPlayerState(PLAYER_STATES.ENDED)
    renderVideoPlayer()

    const replayButton = await screen.findByRole(AccessibilityRole.BUTTON, {
      name: 'Revoir la vidéo',
    })
    fireEvent.press(replayButton)

    expect(replayButton).not.toBeOnTheScreen()
  })

  describe('analytics', () => {
    it('should logHasSeenAllVideo when all video were seen', async () => {
      MockedYouTubePlayer.setPlayerState(PLAYER_STATES.ENDED)

      renderVideoPlayer()

      await waitFor(() => {
        expect(analytics.logHasSeenAllVideo).toHaveBeenCalledWith({
          moduleId: 'abcd',
          videoDuration: 267,
          seenDuration: 135,
        })
      })
    })

    it('should logConsultVideo when player is ready', async () => {
      MockedYouTubePlayer.setPlayerState(PLAYER_STATES.UNSTARTED)

      renderVideoPlayer()

      await waitFor(() => {
        expect(analytics.logConsultVideo).toHaveBeenCalledWith({
          from: 'home',
          homeEntryId: 'xyz',
          moduleId: 'abcd',
        })
      })
    })
  })
})

function renderVideoPlayer() {
  render(
    reactQueryProviderHOC(
      <VideoPlayer
        youtubeVideoId={videoModuleFixture.youtubeVideoId}
        offer={mockOffer}
        onPressSeeOffer={hideModalMock}
        moduleId="abcd"
        moduleName="lujipeka"
        homeEntryId="xyz"
        playerRef={mockRef}
      />
    )
  )
}
