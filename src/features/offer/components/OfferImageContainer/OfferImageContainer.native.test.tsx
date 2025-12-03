import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: () => jest.fn(),
  useRegisterAnchor: () => jest.fn(),
}))

const consentState: ConsentStatus = { state: ConsentState.LOADING }

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}

jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

describe('<OfferImageContainer />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])
  })

  it('should display image inside carousel when offer has only one image with no pagination', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      )
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
  })

  it('should not display carousel dots when offer has only one', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      )
    )
    await screen.findByTestId('offerImageContainerCarousel')

    expect(screen.queryByTestId('carousel-dot')).not.toBeOnTheScreen()
  })

  it('should display image inside carousel when offer has several images', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      )
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
  })

  it('should display carousel dots when offer has several images', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      )
    )

    await screen.findByTestId('offerImageContainerCarousel')

    await waitFor(() => {
      const dots = screen.queryAllByTestId('carousel-dot')

      expect(dots).toHaveLength(2)
    })
  })

  it('should display image placeholder outside carousel when image url defined', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={undefined}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          placeholderImage="placeholder_image"
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      )
    )

    expect(await screen.findByTestId('placeholderImage')).toBeOnTheScreen()
  })

  it('should not set sticky position in native', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          placeholderImage="placeholder_image"
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
        />
      ),
      { theme: { isNative: true, isDesktopViewport: true } }
    )

    const container = await screen.findByTestId('imageRenderer')

    expect(container).not.toHaveStyle({ position: 'sticky' })
  })

  it('should not display see video button when AB testing segment is not A and AB Testing FF activated', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="B"
          enableVideoABTesting
        />
      )
    )

    await screen.findByTestId('offerImageContainerCarousel')

    expect(screen.queryByText('Voir la vidéo')).not.toBeOnTheScreen()
  })

  it('should display see video button when AB testing segment is A and AB Testing FF activated', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="A"
          enableVideoABTesting
        />
      )
    )

    await screen.findByTestId('offerImageContainerCarousel')

    expect(screen.getByText('Voir la vidéo')).toBeOnTheScreen()
  })

  it('should display see video button when AB testing segment is not A and AB Testing FF deactivated', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
          segment="B"
          enableVideoABTesting={false}
        />
      )
    )

    await screen.findByTestId('offerImageContainerCarousel')

    expect(screen.getByText('Voir la vidéo')).toBeOnTheScreen()
  })
})
