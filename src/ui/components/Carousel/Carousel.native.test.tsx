import React from 'react'
import { SharedValue } from 'react-native-reanimated'

import { act, fireEvent, render, screen } from 'tests/utils'

import { Carousel, calculateProgress } from './Carousel'

const PROGRESS_VALUE = { value: 0 } as SharedValue<number>
const MOCKED_CAROUSEL_WIDTH = 300
const MOCKED_CAROUSEL_HEIGHT = 200

const mockSetIndex = jest.fn()
const mockRenderItem = jest.fn()

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock')

  return {
    ...Reanimated,
    useAnimatedScrollHandler: jest.fn(),
    useSharedValue: jest.fn(() => PROGRESS_VALUE),
    useAnimatedRef: jest.fn(() => ({
      current: { scrollToIndex: jest.fn() },
    })),
  }
})

describe('Carousel', () => {
  const mockData = [
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
  ]

  it('should renders correctly', () => {
    render(
      <Carousel
        data={mockData}
        renderItem={mockRenderItem}
        currentIndex={0}
        setIndex={mockSetIndex}
        width={300}
        progressValue={PROGRESS_VALUE}
      />
    )

    expect(screen.getByTestId('carousel')).toBeOnTheScreen()
  })

  it('updates progressValue on scroll', async () => {
    render(
      <Carousel
        data={mockData}
        renderItem={mockRenderItem}
        currentIndex={0}
        setIndex={mockSetIndex}
        width={300}
        progressValue={PROGRESS_VALUE}
      />
    )

    const carousel = await screen.findByTestId('carousel')

    await act(async () => {
      fireEvent.scroll(carousel, {
        nativeEvent: {
          contentOffset: { x: MOCKED_CAROUSEL_WIDTH, y: 0 },
          layoutMeasurement: { width: MOCKED_CAROUSEL_WIDTH, height: MOCKED_CAROUSEL_HEIGHT },
          contentSize: { width: MOCKED_CAROUSEL_WIDTH * 3, height: MOCKED_CAROUSEL_HEIGHT },
        },
      })
    })

    expect(mockSetIndex).toHaveBeenCalledTimes(1)
  })
})

describe('calculateProgress', () => {
  it('should calculate correctly progress value', () => {
    expect(calculateProgress(MOCKED_CAROUSEL_WIDTH / 2, MOCKED_CAROUSEL_WIDTH)).toBe(0.5)
  })
})
