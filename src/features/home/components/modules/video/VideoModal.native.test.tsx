import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitForModalToShow } from 'tests/utils'

const hideModalMock = jest.fn()

const mockOffers = mockedAlgoliaResponse.hits

describe('VideoModal', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
  })

  it('should render correctly if modal visible', async () => {
    renderVideoModal()

    await waitForModalToShow()

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
    reactQueryProviderHOC(
      <VideoModal
        homeEntryId="xyz"
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
