import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { RadioSelector } from './RadioSelector'

describe('<RadioSelector />', () => {
  const defaultProps = {
    label: 'Test Label',
    onPress: jest.fn(),
  }

  it('should call onPress when pressed', () => {
    render(<RadioSelector {...defaultProps} />)
    fireEvent.press(screen.getByText('Test Label'))
    expect(defaultProps.onPress).toHaveBeenCalledWith()
  })

  it('should not call onPress when disabled', () => {
    render(<RadioSelector {...defaultProps} disabled />)
    fireEvent.press(screen.getByText('Test Label'))
    expect(defaultProps.onPress).not.toHaveBeenCalled()
  })

  it('should render price when provided', () => {
    render(<RadioSelector {...defaultProps} rightText="5.00" />)
    expect(screen.getByText('5.00')).toBeTruthy()
  })

  it('should render description when provided', () => {
    render(<RadioSelector {...defaultProps} description="Test Description" />)
    expect(screen.getByText('Test Description')).toBeTruthy()
  })
})
