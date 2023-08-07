import React from 'react'
import { Text } from 'react-native'

import { fireEvent, render, screen } from 'tests/utils'

import { Touchable } from './Touchable'

describe('<Touchable />', () => {
  it('should execute callback on press', () => {
    const handleClick = jest.fn()
    render(
      <Touchable onPress={handleClick} accessibilityLabel="accessibility label">
        <Text>Touchable content</Text>
      </Touchable>
    )

    const button = screen.getByRole('button')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
