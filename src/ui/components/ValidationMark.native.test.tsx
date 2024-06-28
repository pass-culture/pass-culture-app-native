import React from 'react'

import { render, screen } from 'tests/utils'

import { ValidationMark } from './ValidationMark'

describe('ValidationMark', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<ValidationMark isValid />)

    expect(screen.queryByTestId('invalid-icon')).not.toBeOnTheScreen()
    expect(screen.getByTestId('valid-icon')).toBeOnTheScreen()
  })

  it('should displat the invalidIcon when isValid is false', () => {
    render(<ValidationMark isValid={false} />)

    expect(screen.getByTestId('invalid-icon')).toBeOnTheScreen()
    expect(screen.queryByTestId('valid-icon')).not.toBeOnTheScreen()
  })
})
