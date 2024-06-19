import React from 'react'

import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { render, screen } from 'tests/utils'

describe('<OfferImageCarouselPagination />', () => {
  it('should display pagination with only dots', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={jest.fn()}
      />
    )

    expect(screen.getByTestId('onlyDotsContainer')).toBeOnTheScreen()
  })

  it('should not display pagination with dots and buttons', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={jest.fn()}
      />
    )

    expect(screen.queryByTestId('buttonsAndDotsContainer')).not.toBeOnTheScreen()
  })
})
