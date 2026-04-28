import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { VideoModule } from 'features/home/components/modules/video/VideoModule'
import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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

  it('should navigate to video module page when pressing video thumbnail', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({ offers: [offerFixture] })
    renderVideoModule()

    const button = screen.getByTestId('video-thumbnail')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('VideoModulePage', {
      color: 'Aquamarine',
      homeEntryId: 'abcd',
      isMultiOffer: false,
      moduleId: '4ZzxHKDN7BvBAxVR6hFbU6',
      moduleName: 'Découvre Lujipeka',
      offerIds: ['12345', '67890'],
      offerTitle: 'Pour aller plus loin…',
      offersModuleParameters: [
        { hitsPerPage: 1, title: 'test music type' },
        { hitsPerPage: 1, title: 'test music type' },
      ],
      videoDescription:
        'Lujipeka répond à vos questions sur sa tournée, sa musique, ses inspirations et pleins d’autres questions&nbsp;!',
      videoPublicationDate: '2023-06-16',
      videoTag: 'FAQ',
      videoTitle: 'Lujipeka répond à vos questions\u00a0!',
      youtubeVideoId: 'qE7xwEZnFP0',
      transcription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus augue nec ligula dapibus, in varius sapien fermentum. Aenean euismod enim ipsum, a lacinia nulla luctus sed. Ut eget pellentesque augue, sed blandit mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce iaculis nunc sapien, at viverra libero mattis non. Integer imperdiet interdum cursus. Donec convallis sodales purus, sed dapibus mi. Nulla efficitur orci quis ante auctor, a semper odio rhoncus. Nulla mollis aliquet sapien at fermentum. Vivamus pharetra dui odio, ut euismod neque laoreet a.',
    })
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

    await screen.findByLabelText(`Média vidéo : ${videoModuleFixture.title}`)

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

  it('should show "Tout voir" button when is multiples offers and more than three offers', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({
      offers: [offerFixture, offerFixture2, offerFixture3, offerFixture4],
    })
    renderVideoModule(true)

    const seeAllButton = screen.getByLabelText(
      'Tout voir pour la sélection Lujipeka répond à vos questions !'
    )

    await screen.findByLabelText(`Média vidéo : ${videoModuleFixture.title}`)

    expect(seeAllButton).toBeOnTheScreen()
  })

  it('should not show "Tout voir" button when is multiples offers and less than three offers', async () => {
    mockUseVideoOffersQuery.mockReturnValueOnce({
      offers: [offerFixture, offerFixture2],
    })
    renderVideoModule(true)

    const seeAllButton = screen.queryByLabelText(
      'Tout voir pour la sélection Lujipeka répond à vos questions !'
    )

    await screen.findByLabelText(`Média vidéo : ${videoModuleFixture.title}`)

    expect(seeAllButton).not.toBeOnTheScreen()
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
