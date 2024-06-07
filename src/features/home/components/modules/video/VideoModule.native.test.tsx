import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useVideoOffers } from 'features/home/api/useVideoOffers'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('features/home/api/useVideoOffers')
const mockUseVideoOffers = useVideoOffers as jest.Mock

describe('VideoModule', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

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

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: videoModuleFixture.id,
      moduleType: 'video',
      index: 1,
      homeEntryId: 'abcd',
      offers: [1234],
    })
  })

  it('should not log ModuleDisplayedOnHomePage event when module is not rendered', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [] })
    renderVideoModule()

    await waitFor(() => {
      expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
    })
  })

  it('should render multi offer component if multiples offers', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture, offerFixture2] })
    renderVideoModule()

    const multiOfferList = screen.getByTestId('video-multi-offers-module-list')

    await act(async () => {})

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should render mobile design if mobile viewport', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    const multiOfferList = screen.getByTestId('mobile-video-module')

    await act(async () => {})

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should render desktop design if desktop viewport', async () => {
    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule(true)

    const multiOfferList = screen.getByTestId('desktop-video-module')

    await act(async () => {})

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should render properly with FF on', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    mockUseVideoOffers.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    await screen.findByText('La nuit des temps')

    expect(screen).toMatchSnapshot()
  })
})

const offerFixture = {
  offer: {
    thumbUrl: 'http://thumbnail',
    subcategoryId: 'CONCERT',
    name: 'La nuit des temps',
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

function renderVideoModule(isDesktopViewport?: boolean) {
  render(
    reactQueryProviderHOC(
      <VideoModule {...videoModuleFixture} index={1} homeEntryId="abcd" shouldShowModal={false} />
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
