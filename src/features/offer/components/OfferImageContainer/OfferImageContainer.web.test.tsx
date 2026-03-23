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
import { render, screen } from 'tests/utils/web'

const mockOnPress = jest.fn()

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

  it('should display carousel with one image', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={mockOnPress}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
        />
      ),
      { theme: { isDesktopViewport: true } }
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeInTheDocument()
  })

  // TODO(PC-30559) : test flaky sur la CI
  // eslint-disable-next-line jest/no-disabled-tests
  it('should display carousel with several images', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={mockOnPress}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
        />
      ),
      { theme: { isDesktopViewport: true } }
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeInTheDocument()
  })

  it('should apply sticky styles when on desktop', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={mockOnPress}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
        />
      ),
      { theme: { isDesktopViewport: true } }
    )

    const container = await screen.findByTestId('imageRenderer')

    expect(container).toHaveStyle({
      position: 'sticky',
    })
  })

  it('should not have sticky position on mobile', async () => {
    render(
      reactQueryProviderHOC(
        <OfferImageContainer
          images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={mockOnPress}
          imageDimensions={mockOfferImageDimensions}
          offer={offerResponseSnap}
        />
      ),
      { theme: { isDesktopViewport: false } }
    )

    const container = await screen.findByTestId('imageRenderer')

    expect(container).not.toHaveStyle({
      position: 'sticky',
    })
  })
})
