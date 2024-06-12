import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { ControlComponent, ControlComponentProps } from './ControlComponent'

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

  it('renders display next arrow when type is next', () => {
    renderControlComponent({
      onPress,
      title: 'Next',
      type: 'next',
    })

    expect(screen.getByTestId('arrowNext')).toBeOnTheScreen()
    expect(() => screen.getByTestId('arrowPrevious')).toThrow()
  })

  it('renders trigger onPress when pressed', () => {
    renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
    })

    fireEvent.press(screen.getByTestId('Previous'))

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
