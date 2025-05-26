import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { ControlComponent, ControlComponentProps } from './ControlComponent'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ControlComponent />', () => {
  const onPress = jest.fn()

  it('should display prev arrow by default', () => {
    renderControlComponent()

    expect(screen.getByTestId('arrowPrevious')).toBeOnTheScreen()
    expect(() => screen.getByTestId('arrowNext')).toThrow()
  })

  it('should display prev arrow when type is prev', () => {
    renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
    })

    expect(screen.getByTestId('arrowPrevious')).toBeOnTheScreen()
    expect(() => screen.getByTestId('arrowNext')).toThrow()
  })

  it('should display next arrow when type is next', () => {
    renderControlComponent({
      onPress,
      title: 'Next',
      type: 'next',
    })

    expect(screen.getByTestId('arrowNext')).toBeOnTheScreen()
    expect(() => screen.getByTestId('arrowPrevious')).toThrow()
  })

  it('should trigger onPress when pressed', async () => {
    renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
    })

    await user.press(screen.getByTestId('Previous'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render prev button with margin left if withMargin is equal to true', () => {
    renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
      withMargin: true,
    })

    const controlButton = screen.getByTestId('Previous')

    expect(controlButton.props.style.marginLeft).toEqual('70%')
  })

  it('should render next button with margin right if withMargin is equal to true', () => {
    renderControlComponent({
      onPress,
      title: 'Next',
      type: 'next',
      withMargin: true,
    })

    const controlButton = screen.getByTestId('Next')

    expect(controlButton.props.style.marginRight).toEqual('70%')
  })
})

function renderControlComponent(
  props: ControlComponentProps = {
    onPress: jest.fn(),
    title: 'Previous',
    type: 'prev',
  }
) {
  return render(<ControlComponent {...props} />)
}
