import React, { ComponentProps } from 'react'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { render, screen } from 'tests/utils/web'
import { theme } from 'theme'

describe('<OfferImageBody />', () => {
  it('should apply sticky styles when on web and isDesktopViewport is true', () => {
    renderOfferImageWrapper({ isDesktopViewport: true })

    const container = screen.getByTestId('imageContainer')

    expect(container).toHaveStyle({
      position: 'sticky',
      top: '113px',
      zIndex: 1,
    })
  })

  it('should not apply sticky styles when on web and isDesktopViewport is false', () => {
    renderOfferImageWrapper({ isDesktopViewport: false })

    const container = screen.getByTestId('imageContainer')

    expect(container).not.toHaveStyle({
      position: 'sticky',
      top: '113px',
      zIndex: 1,
    })
  })

  it('should apply borderRadius when not in carousel', () => {
    renderOfferImageWrapper({
      isDesktopViewport: false,
      isInCarousel: false,
      shouldDisplayOfferPreview: true,
      imageUrl: 'some_url_to_some_resource',
    })

    const container = screen.getByTestId('imageGradient')

    expect(container).toMatchSnapshot()
  })
})

type RenderOfferImageWrapperType = Partial<ComponentProps<typeof OfferImageWrapper>> & {
  isDesktopViewport?: boolean
}

function renderOfferImageWrapper({
  shouldDisplayOfferPreview,
  imageUrl,
  isDesktopViewport,
  isInCarousel,
}: RenderOfferImageWrapperType) {
  render(
    <OfferImageWrapper
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      imageUrl={imageUrl}
      isInCarousel={isInCarousel}>
      <OfferBodyImage imageUrl="some_url_to_some_resource" />
    </OfferImageWrapper>,
    {
      theme: { ...theme, isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
