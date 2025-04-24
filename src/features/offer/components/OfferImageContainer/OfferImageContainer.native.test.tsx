import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useCategoryId')

describe('<OfferImageContainer />', () => {
  it('should display image inside carousel when offer has only one image with no pagination', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(screen.getByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
    expect(screen.queryByTestId('carousel-dot')).not.toBeOnTheScreen()
  })

  it('should not display carousel dots when offer has only one', () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(screen.queryByTestId('carousel-dot')).not.toBeOnTheScreen()
  })

  it('should display image inside carousel when offer has several images', async () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
  })

  it('should display carousel dots when offer has several images', async () => {
    render(
      <OfferImageContainer
        images={[{ url: 'some_url_to_some_resource' }, { url: 'some_url2_to_some_resource' }]}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )
    await screen.findByTestId('offerImageContainerCarousel')

    expect(screen.getAllByTestId('carousel-dot')).toHaveLength(2)
  })

  it('should display image placeholder outside carousel when image url defined', () => {
    render(
      <OfferImageContainer
        images={undefined}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        placeholderImage="placeholder_image"
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(screen.getByTestId('placeholderImage')).toBeOnTheScreen()
  })

  it('should not set sticky position in native', () => {
    render(
      <OfferImageContainer
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        placeholderImage="placeholder_image"
        imageDimensions={mockOfferImageDimensions}
      />,
      {
        theme: { isNative: true, isDesktopViewport: true },
      }
    )

    const container = screen.getByTestId('imageRenderer')

    expect(container).not.toHaveStyle({
      position: 'sticky',
    })
  })
})
