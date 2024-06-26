import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Animated, TouchableOpacity } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { RoundedButton } from './RoundedButton'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const animatedValue = new Animated.Value(0)
const DummyComponent: React.FC = () => {
  const iconBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0)'],
  })

  const iconBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 0)'],
  })
  const onPress = () => {
    Animated.timing(animatedValue, { useNativeDriver: false, toValue: 1, duration: 100 }).start()
  }
  return (
    <TouchableOpacity testID="dummyPressable" onPress={onPress}>
      <RoundedButton
        iconName="back"
        onPress={jest.fn()}
        animationState={{ iconBackgroundColor, iconBorderColor, transition: animatedValue }}
        accessibilityLabel="Revenir en arrière"
      />
    </TouchableOpacity>
  )
}

describe('RoundedButton', () => {
  describe('Icon', () => {
    it('should display icon without animation', () => {
      render(
        <RoundedButton
          iconName="back"
          onPress={jest.fn()}
          accessibilityLabel="Revenir en arrière"
        />
      )

      expect(screen.getByTestId('icon-back')).toBeOnTheScreen()
      expect(screen.queryByTestId('animated-icon-back')).not.toBeOnTheScreen()
    })
  })

  describe('AnimatedIcon', () => {
    it('should display animated icon', () => {
      render(<DummyComponent />)

      expect(screen.queryByTestId('icon-back')).not.toBeOnTheScreen()
      expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
    })

    it('should display initial colors before animation', () => {
      render(<DummyComponent />)

      const roundContainer = screen.getByTestId('AnimatedHeaderIconRoundContainer')

      expect(roundContainer.props.style.backgroundColor).toBe('rgba(255, 255, 255, 1)')
      expect(roundContainer.props.style.borderColor).toBe('rgba(0, 0, 0, 1)')
    })

    it('should display final colors after animation', async () => {
      render(<DummyComponent />)

      fireEvent.press(screen.getByTestId('dummyPressable'))

      const roundContainer = screen.getByTestId('AnimatedHeaderIconRoundContainer')
      await waitFor(() => {
        expect(roundContainer.props.style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
        expect(roundContainer.props.style.borderColor).toBe('rgba(255, 255, 255, 0)')
      })
    })

    it('should convey animatedValue to AnimatedIcon', () => {
      render(<DummyComponent />)

      const animatedIcon = screen.getByTestId('AnimatedHeaderIconRoundContainer')
        .children[0] as ReactTestInstance

      expect(animatedIcon.props.transition).toBe(animatedValue)
    })
  })
})
