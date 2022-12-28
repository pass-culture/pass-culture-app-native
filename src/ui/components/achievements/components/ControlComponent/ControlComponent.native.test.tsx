import React from 'react'

import { fireEvent, render } from 'tests/utils'

import { ControlComponent, ControlComponentProps } from './ControlComponent'

describe('<ControlComponent />', () => {
  const onPress = jest.fn()

  beforeEach(onPress.mockClear)

  it('should render correctly prev by default', () => {
    const renderAPI = renderControlComponent()
    expect(renderAPI).toMatchSnapshot()
    expect(renderAPI.getByTestId('arrowPrevious')).toBeTruthy()
    expect(() => renderAPI.getByTestId('arrowNext')).toThrowError()
  })

  it('should render prev when type is prev', () => {
    const renderAPI = renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
    })
    expect(renderAPI).toMatchSnapshot()
    expect(renderAPI.getByTestId('arrowPrevious')).toBeTruthy()
    expect(() => renderAPI.getByTestId('arrowNext')).toThrowError()
  })

  it('renders render next when type is next', () => {
    const renderAPI = renderControlComponent({
      onPress,
      title: 'Next',
      type: 'next',
    })
    expect(renderAPI).toMatchSnapshot()
    expect(renderAPI.getByTestId('arrowNext')).toBeTruthy()
    expect(() => renderAPI.getByTestId('arrowPrevious')).toThrowError()
  })

  it('renders trigger onPress when pressed', () => {
    const { getByTestId } = renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
    })
    fireEvent.press(getByTestId('Previous'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render prev button with margin left if withMargin is equal to true', () => {
    const { getByTestId } = renderControlComponent({
      onPress,
      title: 'Previous',
      type: 'prev',
      withMargin: true,
    })
    const controlButton = getByTestId('Previous')
    expect(controlButton.props.style.marginLeft).toEqual('70%')
  })

  it('should render next button with margin right if withMargin is equal to true', () => {
    const { getByTestId } = renderControlComponent({
      onPress,
      title: 'Next',
      type: 'next',
      withMargin: true,
    })
    const controlButton = getByTestId('Next')
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
