import React from 'react'

import { userEvent, render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { Touchable } from './Touchable'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<Touchable />', () => {
  it('should execute callback on press', async () => {
    const handleClick = jest.fn()
    render(
      <Touchable onPress={handleClick} accessibilityLabel="accessibility label">
        <Typo.Body>Touchable content</Typo.Body>
      </Touchable>
    )

    const button = screen.getByRole('button')
    await user.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
