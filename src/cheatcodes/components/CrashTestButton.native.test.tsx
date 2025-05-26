import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { CrashTestButton } from './CrashTestButton'

const user = userEvent.setup()
jest.useFakeTimers()

describe('CrashTestButton component', () => {
  it('should throw an error', async () => {
    render(<CrashTestButton />)
    const Button = screen.getByTestId('crashTestButton')

    await expect(user.press(Button)).rejects.toThrow('Test crash')
  })
})
