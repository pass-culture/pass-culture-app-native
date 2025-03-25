import React, { ComponentProps } from 'react'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen } from 'tests/utils'

describe('<OfferImageBody />', () => {
  it('should display image gradient when offer preview feature flag activated and image url defined', () => {
    renderOfferImageWrapper({
      shouldDisplayOfferPreview: true,
      imageUrl: 'some_url_to_some_resource',
    })

    expect(screen.getByTestId('imageGradient')).toBeOnTheScreen()
  })

  it('should not display image gradient when offer preview feature flag deactivated and image url defined', () => {
    renderOfferImageWrapper({
      shouldDisplayOfferPreview: false,
      imageUrl: 'some_url_to_some_resource',
    })

    expect(screen.queryByTestId('imageGradient')).not.toBeOnTheScreen()
  })

  it('should not display image gradient when offer preview feature flag activated and image url not defined', () => {
    renderOfferImageWrapper({
      shouldDisplayOfferPreview: true,
    })

    expect(screen.queryByTestId('imageGradient')).not.toBeOnTheScreen()
  })
})

type RenderOfferImageWrapperType = Partial<ComponentProps<typeof OfferImageWrapper>>

function renderOfferImageWrapper({
  shouldDisplayOfferPreview,
  imageUrl,
}: RenderOfferImageWrapperType) {
  render(
    <OfferImageWrapper
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      imageUrl={imageUrl}
      imageDimensions={mockOfferImageDimensions}>
      <OfferBodyImage
        imageUrl="some_url_to_some_resource"
        imageDimensions={mockOfferImageDimensions}
      />
    </OfferImageWrapper>
  )
}
