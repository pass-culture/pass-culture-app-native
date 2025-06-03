import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen } from 'tests/utils/web'

const mockOnPress = jest.fn()

describe('<OfferImageContainer />', () => {
  it('should display carousel with one image', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
        imageDimensions={mockOfferImageDimensions}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByTestId('offerImageContainerCarousel')).toBeInTheDocument()
  })

  // TODO(PC-30559) : test flaky sur la CI
  // eslint-disable-next-line jest/no-disabled-tests
  it('should display carousel with several images', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
        imageDimensions={mockOfferImageDimensions}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByTestId('offerImageContainerCarousel')).toBeInTheDocument()
  })

  it('should apply sticky styles when on desktop', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
        imageDimensions={mockOfferImageDimensions}
      />,
      { theme: { isDesktopViewport: true } }
    )

    const container = screen.getByTestId('imageRenderer')

    expect(container).toHaveStyle({
      position: 'sticky',
    })
  })

  it('should not have sticky position on mobile', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
        imageDimensions={mockOfferImageDimensions}
      />,
      { theme: { isDesktopViewport: false } }
    )

    const container = screen.getByTestId('imageRenderer')

    expect(container).not.toHaveStyle({
      position: 'sticky',
    })
  })
})
