import React from 'react'
import { Animated } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import waitForExpect from 'wait-for-expect'

import { fireEvent, render } from 'tests/utils/web'

import { Logo } from '../../svg/icons/Logo'
import { ColorsEnum } from '../../theme/colors'
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
        initialColor={ColorsEnum.PRIMARY}
        finalColor={ColorsEnum.SECONDARY}
      />
    </TouchableOpacity>
  )
}
describe('AnimatedIcon', () => {
  it('should display only the first color before animation', () => {
    const { getByTestId } = render(<DummyComponent />)
    const initialContainer = getByTestId('initial-icon-container')
    const finalContainer = getByTestId('final-icon-container')
    expect(initialContainer.style.opacity).toBe('1')
    expect(finalContainer.style.opacity).toBe('0')
  })
  // FIXME: web integration
  it.skip('should display only the last color after animation [Web Integration]', async () => {
    const { getByTestId } = render(<DummyComponent />)
    fireEvent.click(getByTestId('dummyPressable'))
    const initialContainer = getByTestId('initial-icon-container')
    const finalContainer = getByTestId('final-icon-container')
    await waitForExpect(() => {
      expect(finalContainer.style.opacity).toBe('1')
    })
    expect(initialContainer.style.opacity).toBe('0')
  })
})
