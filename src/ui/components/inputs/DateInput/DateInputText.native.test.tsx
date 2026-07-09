import React from 'react'

import { render, screen, fireEvent } from 'tests/utils'

import { DateInputText } from './DateInputText'

const defaultProps = {
  date: new Date(2000, 8, 1),
  onChange: jest.fn(),
}

describe('DateInputText', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should display the initial date', () => {
    render(<DateInputText {...defaultProps} />)

    expect(screen.getByDisplayValue('01/09/2000')).toBeTruthy()
  })

  it('should format the input with slashes', () => {
    render(<DateInputText {...defaultProps} />)

    const input = screen.getByDisplayValue('01/09/2000')

    fireEvent.changeText(input, '02092000') // 02/09/2000

    expect(screen.getByDisplayValue('02/09/2000')).toBeTruthy()
  })

  it('should call onChange when entering a valid date', () => {
    const onChange = jest.fn()

    render(<DateInputText {...defaultProps} onChange={onChange} />)

    const input = screen.getByDisplayValue('01/09/2000')

    fireEvent.changeText(input, '15052000') // 15/05/2000

    expect(onChange).toHaveBeenCalledWith(new Date(2000, 4, 15))
  })

  it('should display an error when entering an invalid date', () => {
    render(<DateInputText {...defaultProps} />)

    const input = screen.getByDisplayValue('01/09/2000')

    fireEvent.changeText(input, '31022000') // 31/02/2000

    expect(
      screen.getByText('La date saisie est invalide', { exact: false, hidden: true })
    ).toBeTruthy()
  })

  it('should remove the invalid date error after correcting the date', () => {
    render(<DateInputText {...defaultProps} />)

    const input = screen.getByDisplayValue('01/09/2000')

    fireEvent.changeText(input, '31022000') // 31/02/2000

    expect(
      screen.getByText('La date saisie est invalide', { exact: false, hidden: true })
    ).toBeTruthy()

    fireEvent.changeText(input, '28022000') // 28/02/2000

    expect(
      screen.queryByText('La date saisie est invalide', { exact: false, hidden: true })
    ).toBeNull()
  })

  it('should display the provided errorMessage', () => {
    render(
      <DateInputText
        {...defaultProps}
        errorMessage="Tu dois avoir au moins 15 ans pour t’inscrire au pass Culture"
      />
    )

    expect(
      screen.getByText('Tu dois avoir au moins 15 ans pour t’inscrire au pass Culture', {
        exact: false,
        hidden: true,
      })
    ).toBeTruthy()
  })

  it('should not call onChange with an incomplete date', () => {
    const onChange = jest.fn()

    render(<DateInputText {...defaultProps} onChange={onChange} />)

    const input = screen.getByDisplayValue('01/09/2000')

    fireEvent.changeText(input, '0101') // 01/01

    expect(onChange).not.toHaveBeenCalled()
  })
})
