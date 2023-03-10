import React from 'react'
import { Animated } from 'react-native'

import { fireEvent, render, screen, waitFor } from 'tests/utils/web'
import { theme } from 'theme'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { Logo } from '../../svg/icons/Logo'
import { AnimatedIcon } from '../AnimatedIcon'

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
        initialColor={theme.colors.primary}
        finalColor={theme.colors.secondary}
      />
    </TouchableOpacity>
  )
}
describe('AnimatedIcon', () => {
  it('should display only the first color before animation', () => {
    render(<DummyComponent />)
    const initialContainer = screen.getByTestId('initial-icon-container')
    const finalContainer = screen.getByTestId('final-icon-container')
    expect(initialContainer.style.opacity).toBe('1')
    expect(finalContainer.style.opacity).toBe('0')
  })

  it('should display only the last color after animation [Web Integration]', async () => {
    render(<DummyComponent />)
    fireEvent.click(screen.getByTestId('dummyPressable'))
    const initialContainer = screen.getByTestId('initial-icon-container')
    const finalContainer = screen.getByTestId('final-icon-container')
    await waitFor(() => {
      expect(finalContainer.style.opacity).toBe('1')
    })
    expect(initialContainer.style.opacity).toBe('0')
  })
})
