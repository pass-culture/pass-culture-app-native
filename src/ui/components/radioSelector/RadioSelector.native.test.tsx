import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { RadioSelector, RadioSelectorType } from './RadioSelector'

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
    render(<RadioSelector {...defaultProps} type={RadioSelectorType.DISABLED} />)
    fireEvent.press(screen.getByText('Test Label'))
    expect(defaultProps.onPress).not.toHaveBeenCalled()
  })

  it('should render price when provided', () => {
    render(<RadioSelector {...defaultProps} price="5.00" />)
    expect(screen.getByText('5.00')).toBeTruthy()
  })

  it('should render description when provided', () => {
    render(<RadioSelector {...defaultProps} description="Test Description" />)
    expect(screen.getByText('Test Description')).toBeTruthy()
  })

  it('should render <RadioButtonSelectedPrimary /> when type is active', () => {
    render(<RadioSelector {...defaultProps} type={RadioSelectorType.ACTIVE} />)
    expect(screen.getByTestId('radio-button-selected-primary')).toBeTruthy()
  })

  it('should render <ValidateOffIcon /> when type is not active', () => {
    render(<RadioSelector {...defaultProps} />)
    expect(screen.getByTestId('validate-off-icon')).toBeTruthy()
  })
})
