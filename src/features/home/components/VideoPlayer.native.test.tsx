import React from 'react'

import { VideoPlayer } from 'features/home/components/VideoPlayer'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { render, screen } from 'tests/utils'
const mockOffer = mockedAlgoliaResponse.hits[0]
const hideModalMock = jest.fn()

const showErrorUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

const showError: unknown = true
const hideError: unknown = false

describe('VideoPlayer', () => {
  it('should render error view when showErrorView is true', async () => {
    mockUseState.mockImplementationOnce(() => showErrorUseState(showError))

    render(
      <VideoPlayer
        youtubeVideoId={videoModuleFixture.youtubeVideoId}
        offer={mockOffer}
        onPressSeeOffer={hideModalMock}
        videoThumbnail={videoModuleFixture.videoThumbnail}
      />
    )

    const errorMessage = screen.queryByText(
      'Une erreur s’est produite pendant le chargement de la vidéo.'
    )

    expect(errorMessage).not.toBeNull()
  })

  it('should not render error view when showErrorView is false', async () => {
    mockUseState.mockImplementationOnce(() => showErrorUseState(hideError))

    render(
      <VideoPlayer
        youtubeVideoId={videoModuleFixture.youtubeVideoId}
        offer={mockOffer}
        onPressSeeOffer={hideModalMock}
        videoThumbnail={videoModuleFixture.videoThumbnail}
      />
    )

    const errorMessage = screen.queryByText(
      'Une erreur s’est produite pendant le chargement de la vidéo.'
    )

    expect(errorMessage).toBeNull()
  })
})
