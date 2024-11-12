import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { render, screen, userEvent } from 'tests/utils'

import { OfferImageCarousel } from './OfferImageCarousel'

describe('OfferImageCarousel', () => {
  const user = userEvent.setup()

  it('should render one image without pagination', async () => {
    const mockOnload = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={['https://image1.jpg']}
        onItemPress={jest.fn()}
        onLoad={mockOnload}
      />
    )

    await screen.findByLabelText('Carousel image 1')

    expect(screen.getByLabelText('Carousel image 1')).toBeOnTheScreen()
    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeOnTheScreen()

    expect(mockOnload).toHaveBeenCalledTimes(1)
  })

  it('should render multiple image with pagination', async () => {
    const mockOnload = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={['https://image1.jpg', 'https://image2.jpg', 'https://image3.jpg']}
        onItemPress={jest.fn()}
        onLoad={mockOnload}
      />
    )

    await screen.findByTestId('onlyDotsContainer')

    expect(screen.getAllByLabelText(/Carousel image/)).toHaveLength(3)
    expect(screen.getByTestId('onlyDotsContainer')).toBeOnTheScreen()

    expect(mockOnload).toHaveBeenCalledTimes(1)
  })

  it('should trigger onItemPress when click on image', async () => {
    jest.useFakeTimers()
    const mockOnItemPress = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={['https://image1.jpg', 'https://image2.jpg', 'https://image3.jpg']}
        onItemPress={mockOnItemPress}
        onLoad={jest.fn()}
      />
    )

    await user.press(screen.getByLabelText('Carousel image 3'))

    expect(mockOnItemPress).toHaveBeenCalledWith(2)

    jest.useRealTimers()
  })
})
