import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { mockSettings } from 'features/auth/context/mockSettings'
import { render, screen, userEvent } from 'tests/utils'

import { OfferImageCarousel } from './OfferImageCarousel'

mockSettings()

describe('OfferImageCarousel', () => {
  const user = userEvent.setup()

  it('should render one image without pagination', async () => {
    const mockOnload = jest.fn()
    render(
      <OfferImageCarousel
        progressValue={1 as unknown as SharedValue<number>}
        offerImages={[{ url: 'https://image1.jpg' }]}
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
        offerImages={[
          { url: 'https://image1.jpg' },
          { url: 'https://image2.jpg' },
          { url: 'https://image3.jpg' },
        ]}
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
        offerImages={[
          { url: 'https://image1.jpg' },
          { url: 'https://image2.jpg' },
          { url: 'https://image3.jpg' },
        ]}
        onItemPress={mockOnItemPress}
        onLoad={jest.fn()}
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
      />
    )

    expect(await screen.findByText('© Cédric')).toBeOnTheScreen()
  })
})
