import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.useFakeTimers()

const hideModalMock = jest.fn()

const mockOffers = mockedAlgoliaResponse.hits

describe('VideoModal', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

  it('should render correctly if modal visible', async () => {
    renderVideoModal()

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
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
