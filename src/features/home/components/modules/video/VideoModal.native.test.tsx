import React from 'react'

import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

const mockOffers = mockedAlgoliaResponse.hits

describe('VideoModal', () => {
  it('should render correctly if modal visible', async () => {
    renderVideoModal()

    await act(async () => {
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      await sleep(300)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should log HasDismissedModal when pressing close button', async () => {
    renderVideoModal()

    const closeButton = screen.getByTestId('Fermer la modale vidéo')

    await act(async () => {
      fireEvent.press(closeButton)
    })

    expect(analytics.logHasDismissedModal).toHaveBeenNthCalledWith(1, {
      moduleId: 'abcd',
      modalType: 'video',
    })
  })
})

function renderVideoModal() {
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <VideoModal
        homeEntryId={'xyz'}
        visible
        hideModal={hideModalMock}
        offers={mockOffers}
        moduleId="abcd"
        isMultiOffer={false}
        {...videoModuleFixture}
      />
    )
  )
}
