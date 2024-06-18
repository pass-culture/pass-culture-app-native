import React from 'react'

import { WebOfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/WebOfferImageCarouselPagination'
import { fireEvent, render, screen } from 'tests/utils'

const mockHandlePressButton = jest.fn()

describe('<WebOfferImageCarouselPagination />', () => {
  it('should display pagination with dots and buttons', () => {
    render(
      <WebOfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    expect(screen.getByTestId('buttonsAndDotsContainer')).toBeOnTheScreen()
  })

  it('should not display pagination with only dots', () => {
    render(
      <WebOfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeOnTheScreen()
  })

  it('should handle previous button clicking', () => {
    render(
      <WebOfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const previousButton = screen.getByTestId('Image précédente')
    fireEvent.press(previousButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, -1)
  })

  it('should handle next button clicking', () => {
    render(
      <WebOfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const nextButton = screen.getByTestId('Image suivante')
    fireEvent.press(nextButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, 1)
  })
})
