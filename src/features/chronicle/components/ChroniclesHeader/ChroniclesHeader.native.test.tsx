import React from 'react'
import { Animated } from 'react-native'

import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import * as useGoBack from 'features/navigation/useGoBack'
import { act, render, screen, userEvent } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ChroniclesHeader />', () => {
  it('should goBack when we press on the back button', async () => {
    renderChroniclesHeader()

    await user.press(screen.getByTestId('animated-icon-back'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue } = renderChroniclesHeader()

    expect(screen.getByTestId('chroniclesHeaderName').props.accessibilityHidden).toBeTruthy()
    expect(screen.getByTestId('chroniclesHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })

    expect(screen.getByTestId('chroniclesHeaderName').props.accessibilityHidden).toBe(false)
    expect(screen.getByTestId('chroniclesHeaderName').props.style.opacity).toBe(1)
  })
})

function renderChroniclesHeader() {
  const animatedValue = new Animated.Value(0)
  render(
    <ChroniclesHeader
      title='Tous les avis de "Mon oeuvre incroyable"'
      headerTransition={animatedValue}
    />
  )
  return { animatedValue }
}
