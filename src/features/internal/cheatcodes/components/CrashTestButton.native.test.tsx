import React from 'react'

import { render, fireEvent, screen } from 'tests/utils'

import { CrashTestButton } from './CrashTestButton'

describe('CrashTestButton component', () => {
  it('should throw an error', async () => {
    render(<CrashTestButton />)
    const Button = screen.getByTestId('crashTestButton')

    expect(() => fireEvent.press(Button)).toThrow('Test crash')
  })
})
