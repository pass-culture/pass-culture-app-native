import React from 'react'

import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination.web'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockHandlePressButton = jest.fn()

describe('<OfferImageCarouselPagination />', () => {
  it('should display pagination with dots and buttons', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    expect(screen.getByTestId('buttonsAndDotsContainer')).toBeInTheDocument()
  })

  it('should not display pagination with only dots', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeInTheDocument()
  })

  it('should handle previous button clicking', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const previousButton = screen.getByTestId('Image précédente')
    fireEvent.click(previousButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, -1)
  })

  it('should handle next button clicking', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const nextButton = screen.getByTestId('Image suivante')
    fireEvent.click(nextButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, 1)
  })
})
