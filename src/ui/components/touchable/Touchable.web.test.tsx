import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { Touchable } from './Touchable'

describe('<Touchable />', () => {
  it('should execute callback on click', () => {
    const handleClick = jest.fn()
    render(
      <Touchable onPress={handleClick}>
        <Typo.Body>Touchable content</Typo.Body>
      </Touchable>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
