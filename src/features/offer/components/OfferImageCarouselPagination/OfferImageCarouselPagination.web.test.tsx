import React from 'react'

import { OfferImageCarouselPagination } from 'features/offer/components/OfferImageCarouselPagination/OfferImageCarouselPagination.web'
import { render, screen, userEvent } from 'tests/utils/web'

const mockHandlePressButton = jest.fn()

describe('<OfferImageCarouselPagination />', () => {
  const user = userEvent.setup()

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

  it('should handle previous button clicking', async () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const previousButton = screen.getByTestId('Image précédente')
    await user.click(previousButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, -1)
  })

  it('should handle next button clicking', async () => {
    render(
      <OfferImageCarouselPagination
        progressValue={{ value: 0 }}
        offerImages={['image1', 'image2']}
        handlePressButton={mockHandlePressButton}
      />
    )

    const nextButton = screen.getByTestId('Image suivante')
    await user.click(nextButton)

    expect(mockHandlePressButton).toHaveBeenNthCalledWith(1, 1)
  })
})
