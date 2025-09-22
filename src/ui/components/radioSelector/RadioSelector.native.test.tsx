import React from 'react'

import { userEvent, render, screen } from 'tests/utils'

import { RadioSelector } from './RadioSelector'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<RadioSelector />', () => {
  const defaultProps = {
    label: 'Test Label',
    checked: false,
    onPress: jest.fn(),
  }

  it('should call onPress when pressed', async () => {
    render(<RadioSelector {...defaultProps} />)
    await user.press(screen.getByText('Test Label'))

    expect(defaultProps.onPress).toHaveBeenCalledWith()
  })

  it('should not call onPress when disabled', async () => {
    render(<RadioSelector {...defaultProps} disabled />)
    await user.press(screen.getByText('Test Label'))

    expect(defaultProps.onPress).not.toHaveBeenCalled()
  })

  it('should render price when provided', () => {
    render(<RadioSelector {...defaultProps} rightText="5.00" />)

    expect(screen.getByText('5.00')).toBeOnTheScreen()
  })

  it('should render description when provided', () => {
    render(<RadioSelector {...defaultProps} description="Test Description" />)

    expect(screen.getByText('Test Description')).toBeOnTheScreen()
  })
})
