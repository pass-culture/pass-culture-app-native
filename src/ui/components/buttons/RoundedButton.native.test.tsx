import React from 'react'
import { Animated } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils'

import { RoundedButton } from './RoundedButton'

const animatedValue = new Animated.Value(0)
const DummyComponent: React.FC = () => {
  const iconBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 255, 0, 1)', 'rgba(255, 0, 255, 0)'],
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
      const { queryByTestId } = render(
        <RoundedButton
          iconName="back"
          onPress={jest.fn()}
          accessibilityLabel="Revenir en arrière"
        />
      )
      expect(queryByTestId('icon-back')).toBeTruthy()
      expect(queryByTestId('animated-icon-back')).toBeFalsy()
    })
  })

  describe('AnimatedIcon', () => {
    it('should display animated icon', () => {
      const { queryByTestId } = render(<DummyComponent />)
      expect(queryByTestId('icon-back')).toBeFalsy()
      expect(queryByTestId('animated-icon-back')).toBeTruthy()
    })

    it('should display initial colors before animation', () => {
      const { getByTestId } = render(<DummyComponent />)
      const roundContainer = getByTestId('AnimatedHeaderIconRoundContainer')
      expect(roundContainer.props.style.backgroundColor).toBe('rgba(0, 255, 0, 1)')
      expect(roundContainer.props.style.borderColor).toBe('rgba(0, 0, 0, 1)')
    })

    it('should display final colors after animation', async () => {
      const { getByTestId } = render(<DummyComponent />)
      fireEvent.press(getByTestId('dummyPressable'))
      const roundContainer = getByTestId('AnimatedHeaderIconRoundContainer')
      await waitForExpect(() => {
        expect(roundContainer.props.style.backgroundColor).toBe('rgba(255, 0, 255, 0)')
      })
      expect(roundContainer.props.style.borderColor).toBe('rgba(255, 255, 255, 0)')
    })

    it('should convey animatedValue to AnimatedIcon', () => {
      const { getByTestId } = render(<DummyComponent />)
      const animatedIcon = getByTestId('AnimatedHeaderIconRoundContainer')
        .children[0] as ReactTestInstance
      expect(animatedIcon.props.transition).toBe(animatedValue)
    })
  })
})
