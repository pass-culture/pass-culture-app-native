import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { RadioSelector, RadioSelectorType } from './RadioSelector'

// Workaround for missing addEventListener function in tests when using React Native.
// This sets the global function to an empty callback, ensuring that the code doesn't break during testing.
global.addEventListener = () => {}

describe('<RadioSelector />', () => {
  const defaultProps = {
    label: 'Test Label',
    onPress: jest.fn(),
  }

  it('should call onPress when pressed', () => {
    render(<RadioSelector {...defaultProps} />)
    fireEvent.press(screen.getByText('Test Label'))
    expect(defaultProps.onPress).toHaveBeenCalledWith('Test Label', RadioSelectorType.ACTIVE)
  })

  it('should not call onPress when disabled', () => {
    render(<RadioSelector {...defaultProps} type={RadioSelectorType.DISABLED} />)
    fireEvent.press(screen.getByText('Test Label'))
    expect(defaultProps.onPress).not.toHaveBeenCalled()
  })

  it('should render price when provided', () => {
    render(<RadioSelector {...defaultProps} price="5.00" />)
    expect(screen.getByText('5.00€')).toBeTruthy()
  })

  it('should render description when provided', () => {
    render(<RadioSelector {...defaultProps} description="Test Description" />)
    expect(screen.getByText('Test Description')).toBeTruthy()
  })
})
