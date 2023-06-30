import React from 'react'
import { Text } from 'react-native'

import { fireEvent, render, screen } from 'tests/utils/web'

import { Touchable } from '../Touchable'

describe('<Touchable />', () => {
  it('should render correctly', () => {
    const handleClick = jest.fn()
    const renderTouchable = render(
      <Touchable onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })

  it('should render correctly on custom type', () => {
    const handleClick = jest.fn()
    const renderTouchable = render(
      <Touchable type="reset" onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })

  it('should execute callback on click', () => {
    const handleClick = jest.fn()
    render(
      <Touchable onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
