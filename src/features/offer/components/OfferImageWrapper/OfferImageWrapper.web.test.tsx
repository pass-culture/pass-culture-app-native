import React, { ComponentProps } from 'react'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { render, screen, waitFor } from 'tests/utils/web'
import { theme } from 'theme'

describe('<OfferImageBody />', () => {
  it('should apply borderRadius when not in carousel', async () => {
    renderOfferImageWrapper({
      isDesktopViewport: false,
      isInCarousel: false,
      shouldDisplayOfferPreview: true,
      imageUrl: 'some_url_to_some_resource',
    })

    const container = screen.getByTestId('imageGradient')

    await waitFor(() =>
      expect(container).toHaveStyle({
        borderTopLeftRadius: theme.borderRadius.radius + 'px',
        borderTopRightRadius: theme.borderRadius.radius + 'px',
        borderBottomRightRadius: theme.borderRadius.radius + 'px',
        borderBottomLeftRadius: theme.borderRadius.radius + 'px',
      })
    )
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
