import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { render, screen, fireEvent } from 'tests/utils/web'

import { OfferImageCarousel } from './OfferImageCarousel'

describe('OfferImageCarousel', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation()
  })

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

    expect(screen.getByLabelText('Carousel image 1')).toBeInTheDocument()
    expect(screen.queryByTestId('onlyDotsContainer')).not.toBeInTheDocument()

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

    await screen.findByTestId('buttonsAndDotsContainer')

    expect(screen.getAllByLabelText(/Carousel image/)).toHaveLength(3)
    expect(screen.getByTestId('buttonsAndDotsContainer')).toBeInTheDocument()

    expect(mockOnload).toHaveBeenCalledTimes(1)
  })

  it('should trigger onItemPress when click on image', async () => {
    const mockOnItemPress = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={['https://image1.jpg', 'https://image2.jpg', 'https://image3.jpg']}
        onItemPress={mockOnItemPress}
        onLoad={jest.fn()}
      />
    )

    await fireEvent.click(screen.getByLabelText('Carousel image 3'))

    expect(mockOnItemPress).toHaveBeenCalledWith(2)
  })
})