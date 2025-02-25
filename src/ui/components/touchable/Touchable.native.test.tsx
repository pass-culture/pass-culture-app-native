import React from 'react'
import { Text } from 'react-native'

import { userEvent, render, screen } from 'tests/utils'

import { Touchable } from './Touchable'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<Touchable />', () => {
  it('should execute callback on press', async () => {
    const handleClick = jest.fn()
    render(
      <Touchable onPress={handleClick} accessibilityLabel="accessibility label">
        <Text>Touchable content</Text>
      </Touchable>
    )

    const button = screen.getByRole('button')
    await user.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
