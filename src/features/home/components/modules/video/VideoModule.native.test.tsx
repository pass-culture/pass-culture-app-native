import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('features/home/queries/useVideoOffersQuery')
const mockUseVideoOffersQuery = useVideoOffersQuery as jest.Mock

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('VideoModule', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render properly', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    expect(await screen.findByText(offerFixture.offer.name)).toBeOnTheScreen()
  })

  it('should show modal when pressing video thumbnail', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    const button = screen.getByTestId('video-thumbnail')

    await user.press(button)

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should log ModuleDisplayedOnHomePage event when seeing the module', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    await screen.findByText(offerFixture.offer.name)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: videoModuleFixture.id,
      moduleType: 'video',
      index: 1,
      homeEntryId: 'abcd',
      offers: [1234],
    })
  })

  it('should not log ModuleDisplayedOnHomePage event when module is not rendered', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [] })
    renderVideoModule()

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should render multi offer component if multiples offers', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture, offerFixture2] })
    renderVideoModule()

    const multiOfferList = screen.getByTestId('video-multi-offers-module-list')

    await screen.findByLabelText(videoModuleFixture.title)

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should render one offer component when one offer', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    expect(await screen.findByTestId('videoMonoOfferTile')).toBeOnTheScreen()
  })

  it('should render mobile design if mobile viewport', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    const multiOfferList = screen.getByTestId('mobile-video-module')

    await screen.findByText(offerFixture.offer.name)

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should render desktop design if desktop viewport', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule(true)

    const multiOfferList = screen.getByTestId('desktop-video-module')

    await screen.findByText(offerFixture.offer.name)

    expect(multiOfferList).toBeOnTheScreen()
  })

  it('should show SeeMore button when is multiples offers and more than three offers', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({
      offers: [offerFixture, offerFixture2, offerFixture3, offerFixture4],
    })
    renderVideoModule(true)

    const seeMoreWording = screen.getByText('Voir tout')

    await screen.findByLabelText(videoModuleFixture.title)

    expect(seeMoreWording).toBeOnTheScreen()
  })

  it('should not show SeeMore button when is multiples offers and less than three offers', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({
      offers: [offerFixture, offerFixture2],
    })
    renderVideoModule(true)

    const seeMoreWording = screen.queryByText('Voir tout')

    await screen.findByLabelText(videoModuleFixture.title)

    expect(seeMoreWording).not.toBeOnTheScreen()
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
const offerFixture3 = {
  offer: {
    thumbUrl: 'http://thumbnail',
    subcategoryId: 'CONFERENCE',
  },
  objectID: 9877,
  venue: {
    id: 5433,
  },
}
const offerFixture4 = {
  offer: {
    thumbUrl: 'http://thumbnail',
    subcategoryId: 'CONFERENCE',
  },
  objectID: 9878,
  venue: {
    id: 5434,
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
