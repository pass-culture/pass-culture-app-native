import React from 'react'

import { useVideoOffers } from 'features/home/api/useVideoOffer'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('features/home/api/useVideoOffer')
const mockUseVideoOffers = useVideoOffers as jest.Mock

describe('VideoModule', () => {
  it('should show modal when pressing video thumbnail', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()
    await act(async () => {})

    const button = screen.getByTestId('video-thumbnail')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should log ModuleDisplayedOnHomePage event when seeing the module', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    await act(async () => {})

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      videoModuleFixture.id,
      'video',
      1,
      'abcd'
    )
  })

  it('should not log ModuleDisplayedOnHomePage event when module is not rendered', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [] })
    renderVideoModule()

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
    })
  })

  it('should render multi offer componant if multiples offers', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture, offerFixture2] })
    renderVideoModule()

    const multiOfferList = screen.getByTestId('videoMultiOffersModuleList')

    await act(async () => {})

    expect(multiOfferList).not.toBeNull()
  })
})

const offerFixture = {
  offer: {
    thumbUrl: 'http://thumbnail',
    subcategoryId: 'CONCERT',
  },
  objectID: 1234,
  venue: {
    id: 5678,
  },
}

const offerFixture2 = {
  offer: {
    thumbUrl: 'http://thumbnail',
    subcategoryId: 'CONFERENCE',
  },
  objectID: 9876,
  venue: {
    id: 5432,
  },
}

function renderVideoModule() {
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<VideoModule {...videoModuleFixture} index={1} homeEntryId="abcd" />)
  )
}
