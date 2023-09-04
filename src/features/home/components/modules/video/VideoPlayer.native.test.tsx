import React from 'react'

import { VideoPlayer } from 'features/home/components/modules/video/VideoPlayer'
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
})

function renderVideoPlayer() {
  render(
    <VideoPlayer
      youtubeVideoId={videoModuleFixture.youtubeVideoId}
      offer={mockOffer}
      onPressSeeOffer={hideModalMock}
      moduleId={'abcd'}
      moduleName={'lujipeka'}
      homeEntryId={'xyz'}
    />
  )
}
