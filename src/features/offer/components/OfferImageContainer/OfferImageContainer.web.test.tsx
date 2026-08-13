import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils/web'

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

  describe('analytics', () => {
    const user = userEvent.setup()

    it('should log OfferImagesScroll when navigating with the arrows', async () => {
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

      await user.click(await screen.findByTestId('Image suivante'))

      await waitFor(() => {
        expect(analytics.logOfferImagesScroll).toHaveBeenCalledWith({
          offerId: offerResponseSnap.id,
          nbImages: 2,
          imageIndex: 1,
          from: 'offer',
        })
      })
    })

    it('should not log OfferImagesScroll when the offer has only one image', async () => {
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

      await screen.findByTestId('offerImageContainerCarousel')

      expect(analytics.logOfferImagesScroll).not.toHaveBeenCalled()
    })

    it('should not log OfferImagesScroll when the offer has no image', async () => {
      render(
        reactQueryProviderHOC(
          <OfferImageContainer
            images={[]}
            categoryId={CategoryIdEnum.CINEMA}
            onPress={mockOnPress}
            imageDimensions={mockOfferImageDimensions}
            offer={offerResponseSnap}
          />
        ),
        { theme: { isDesktopViewport: true } }
      )

      await screen.findByTestId('offerImageContainerCarousel')

      expect(analytics.logOfferImagesScroll).not.toHaveBeenCalled()
    })

    it('should log OfferImagesScroll for each image change', async () => {
      render(
        reactQueryProviderHOC(
          <OfferImageContainer
            images={[
              { url: 'some_url_to_some_resource' },
              { url: 'some_url2_to_some_resource' },
              { url: 'some_url3_to_some_resource' },
            ]}
            categoryId={CategoryIdEnum.CINEMA}
            onPress={mockOnPress}
            imageDimensions={mockOfferImageDimensions}
            offer={offerResponseSnap}
          />
        ),
        { theme: { isDesktopViewport: true } }
      )

      const nextButton = await screen.findByTestId('Image suivante')
      await user.click(nextButton)
      await user.click(nextButton)
      await user.click(await screen.findByTestId('Image précédente'))

      await waitFor(() => {
        expect(analytics.logOfferImagesScroll).toHaveBeenCalledTimes(3)
      })

      expect(analytics.logOfferImagesScroll).toHaveBeenNthCalledWith(1, {
        offerId: offerResponseSnap.id,
        nbImages: 3,
        imageIndex: 1,
        from: 'offer',
      })
      expect(analytics.logOfferImagesScroll).toHaveBeenNthCalledWith(2, {
        offerId: offerResponseSnap.id,
        nbImages: 3,
        imageIndex: 2,
        from: 'offer',
      })
      expect(analytics.logOfferImagesScroll).toHaveBeenNthCalledWith(3, {
        offerId: offerResponseSnap.id,
        nbImages: 3,
        imageIndex: 1,
        from: 'offer',
      })
    })

    it('should not log OfferImagesScroll when already on the last image', async () => {
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

      const nextButton = await screen.findByTestId('Image suivante')
      await user.click(nextButton)
      await user.click(nextButton)

      await waitFor(() => {
        expect(analytics.logOfferImagesScroll).toHaveBeenCalledTimes(1)
      })
    })
  })
})
