import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Animated, TouchableOpacity } from 'react-native'

import { render, screen, userEvent, waitFor } from 'tests/utils'
import { theme } from 'theme'
import { Logo } from 'ui/svg/icons/Logo'

import { AnimatedIcon } from './AnimatedIcon'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const DummyComponent: React.FC = () => {
  const animatedValue = new Animated.Value(0)
  const onPress = () => {
    Animated.timing(animatedValue, { useNativeDriver: false, toValue: 1, duration: 100 }).start()
  }
  return (
    <TouchableOpacity testID="dummyPressable" onPress={onPress}>
      <AnimatedIcon
        transition={animatedValue}
        Icon={Logo}
        testID="icon"
        size={1}
        initialColor={theme.designSystem.color.icon.brandPrimary}
        finalColor={theme.designSystem.color.icon.brandPrimary}
      />
    </TouchableOpacity>
  )
}
const user = userEvent.setup()
jest.useFakeTimers()

describe('AnimatedIcon', () => {
  it('should display only the first color before animation', () => {
    render(<DummyComponent />)

    const initialContainer = screen.getByTestId('initial-icon-container')
    const finalContainer = screen.getByTestId('final-icon-container')

    expect(initialContainer.props.style.opacity).toBe(1)
    expect(finalContainer.props.style.opacity).toBe(0)
  })

  it('should display only the last color after animation', async () => {
    render(<DummyComponent />)

    user.press(screen.getByTestId('dummyPressable'))

    const initialContainer = screen.getByTestId('initial-icon-container')
    const finalContainer = screen.getByTestId('final-icon-container')

    await waitFor(() => {
      expect(finalContainer.props.style.opacity).toBe(1)
      expect(initialContainer.props.style.opacity).toBe(0)
    })
  })
})
