import React from 'react'

import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockOnPressPreviousButton = jest.fn()
const mockOnPressNextButton = jest.fn()

describe('<OfferImageCarouselPagination />', () => {
  it('should display pagination with dots and buttons', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        onPressPreviousButton={mockOnPressPreviousButton}
        onPressNextButton={mockOnPressNextButton}
      />
    )

    expect(screen.getByTestId('buttonsAndDotsContainer')).toBeInTheDocument()
  })

  it('should not display pagination with only dots', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        onPressPreviousButton={mockOnPressPreviousButton}
        onPressNextButton={mockOnPressNextButton}
      />
    )

    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeInTheDocument()
  })

  it('should handle previous button clicking', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        onPressPreviousButton={mockOnPressPreviousButton}
        onPressNextButton={mockOnPressNextButton}
      />
    )

    const previousButton = screen.getByTestId('Image précédente')
    fireEvent.click(previousButton)

    expect(mockOnPressPreviousButton).toHaveBeenCalledTimes(1)
  })

  it('should handle next button clicking', () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        onPressPreviousButton={mockOnPressPreviousButton}
        onPressNextButton={mockOnPressNextButton}
      />
    )

    const nextButton = screen.getByTestId('Image suivante')
    fireEvent.click(nextButton)

    expect(mockOnPressNextButton).toHaveBeenCalledTimes(1)
  })
})
