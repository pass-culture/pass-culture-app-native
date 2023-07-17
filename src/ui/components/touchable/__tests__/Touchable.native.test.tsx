import React from 'react'
import { Text } from 'react-native'

import { fireEvent, render } from 'tests/utils'

import { Touchable } from '../Touchable'

describe('<Touchable />', () => {
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
