import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { TouchableWithoutFeedback } from './TouchableWithoutFeedback.web'

describe('TouchableWithoutFeedback', () => {
  it('calls onPress when clicked', () => {
    const onPress = jest.fn()
    render(<TouchableWithoutFeedback onPress={onPress} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
