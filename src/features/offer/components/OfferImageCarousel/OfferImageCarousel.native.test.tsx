import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { render, screen, userEvent } from 'tests/utils'

import { OfferImageCarousel } from './OfferImageCarousel'

describe('OfferImageCarousel', () => {
  const user = userEvent.setup()

  it('should render one image without pagination', async () => {
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={[{ url: 'https://image1.jpg' }]}
        onItemPress={jest.fn()}
        onLoad={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    await screen.findByLabelText('Carousel image 1')

    expect(screen.queryByTestId('carousel-dot')).not.toBeOnTheScreen()
  })

  it('should render multiple image with pagination', async () => {
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={[
          { url: 'https://image1.jpg' },
          { url: 'https://image2.jpg' },
          { url: 'https://image3.jpg' },
        ]}
        onItemPress={jest.fn()}
        onLoad={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    await screen.findByLabelText('Carousel image 1')

    expect(screen.getAllByLabelText(/Carousel image/)).toHaveLength(3)
    expect(screen.getAllByTestId('carousel-dot')).toHaveLength(3)
  })

  it('should trigger onItemPress when click on image', async () => {
    jest.useFakeTimers()
    const mockOnItemPress = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={[
          { url: 'https://image1.jpg' },
          { url: 'https://image2.jpg' },
          { url: 'https://image3.jpg' },
        ]}
        onItemPress={mockOnItemPress}
        onLoad={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    await user.press(screen.getByLabelText('Carousel image 3'))

    expect(mockOnItemPress).toHaveBeenCalledWith(2)

    jest.useRealTimers()
  })

  it('should display image credit when defined', async () => {
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={[{ url: 'https://image1.jpg', credit: 'Cédric' }]}
        onItemPress={jest.fn()}
        onLoad={jest.fn()}
        imageDimensions={mockOfferImageDimensions}
      />
    )

    expect(await screen.findByText('© Cédric')).toBeOnTheScreen()
  })
})
