import React from 'react'
import { Text } from 'react-native'

import { fireEvent, render } from 'tests/utils'

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

  it('should execute callback on press', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <Touchable onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
