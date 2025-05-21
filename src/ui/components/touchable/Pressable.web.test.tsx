import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { Pressable } from './Pressable.web'

describe('Pressable', () => {
  it('calls onPress when clicked', () => {
    const onPress = jest.fn()
    render(<Pressable onPress={onPress} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
