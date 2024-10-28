import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { ImagesCarousel } from 'ui/components/ImagesCarousel/ImagesCarousel'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))
const user = userEvent.setup()
jest.useFakeTimers()

describe('<ImagesCarousel />', () => {
  const images = ['url1', 'url2']
  const mockGoBack = jest.fn()

  it('should render the carousel with the correct number of images', () => {
    render(<ImagesCarousel images={images} goBack={jest.fn()} defaultIndex={0} />)

    expect(screen.getAllByTestId('carousel-dot')).toHaveLength(images.length)
  })

  it('should handle goBack when pressing back button', async () => {
    render(<ImagesCarousel images={images} goBack={mockGoBack} defaultIndex={0} />)

    await user.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display the correct index in the header', () => {
    render(<ImagesCarousel images={images} goBack={jest.fn()} defaultIndex={1} />)

    expect(screen.getByText('2/2')).toBeOnTheScreen()
  })

  it('should not render dots when there is only one image', () => {
    render(<ImagesCarousel images={['url1']} goBack={jest.fn()} defaultIndex={0} />)

    expect(screen.queryByTestId('carousel-dot')).toBeNull()
  })
})
