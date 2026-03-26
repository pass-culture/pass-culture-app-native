import React from 'react'
import { Animated } from 'react-native'

import { AdvicesHeader } from 'features/advices/components/AdvicesHeader/AdvicesHeader'
import { act, render, screen, userEvent } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const mockHandleGoBack = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('<AdvicesHeader />', () => {
  it('should handle goBack when pressing back button', async () => {
    renderAdvicesHeader()

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockHandleGoBack).toHaveBeenCalledTimes(1)
  })

  it('should fully display the title at the end of the animation', () => {
    const { animatedValue } = renderAdvicesHeader()

    expect(screen.getByTestId('advicesHeaderName').props.accessibilityHidden).toBeTruthy()
    expect(screen.getByTestId('advicesHeaderName').props.style.opacity).toBe(0)

    act(() => {
      Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
      jest.advanceTimersByTime(100)
    })

    expect(screen.getByTestId('advicesHeaderName').props.accessibilityHidden).toBe(false)
    expect(screen.getByTestId('advicesHeaderName').props.style.opacity).toBe(1)
  })
})

function renderAdvicesHeader() {
  const animatedValue = new Animated.Value(0)
  render(
    <AdvicesHeader
      title='Tous les avis de "Mon oeuvre incroyable"'
      headerTransition={animatedValue}
      handleGoBack={mockHandleGoBack}
    />
  )
  return { animatedValue }
}
