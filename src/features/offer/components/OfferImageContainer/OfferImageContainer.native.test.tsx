import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useCategoryId')

describe('<OfferImageContainer />', () => {
  it('should display image inside carousel when offer has only one image with no pagination', () => {
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeOnTheScreen()
  })

  it('should not display carousel dots when offer has only one', () => {
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
      />
    )

    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeOnTheScreen()
  })

  it('should display image inside carousel when offer has several images', async () => {
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
      />
    )

    expect(await screen.findByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
  })

  it('should display carousel dots when offer has several images', async () => {
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
      />
    )
    await screen.findByTestId('offerImageContainerCarousel')

    expect(await screen.findByTestId('onlyDotsContainer')).toBeOnTheScreen()
  })

  it('should display image placeholder outside carousel when image url defined', () => {
    render(
      <OfferImageContainer
        categoryId={CategoryIdEnum.CINEMA}
        onPress={jest.fn()}
        placeholderImage="placeholder_image"
      />
    )

    expect(screen.getByTestId('placeholderImage')).toBeOnTheScreen()
  })
})
