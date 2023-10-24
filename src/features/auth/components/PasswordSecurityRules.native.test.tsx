import React from 'react'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { render, screen } from 'tests/utils'

describe('<PasswordSecurityRules />', () => {
  it('should display 5 rules', async () => {
    render(<PasswordSecurityRules password="" />)

    expect(screen.queryByText('12 caractères')).toBeOnTheScreen()
    expect(screen.queryByText('1 majuscule')).toBeOnTheScreen()
    expect(screen.queryByText('1 minuscule')).toBeOnTheScreen()
    expect(screen.queryByText('1 chiffre')).toBeOnTheScreen()
    expect(screen.queryByText('1 caractère spécial (!@#$%^&*...)')).toBeOnTheScreen()
  })

  it('should not validate any rules if input is empty', () => {
    render(<PasswordSecurityRules password="" />)
    const closeIcons = screen.getAllByTestId('rule-icon-close')

    expect(closeIcons).toHaveLength(5)
  })

  it('should validate capital rule', () => {
    render(<PasswordSecurityRules password="A" />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')

    expect(checkIcons).toHaveLength(1)

    const closeIcons = screen.getAllByTestId('rule-icon-close')

    expect(closeIcons).toHaveLength(4)
  })

  it('should validate lowercase rule', () => {
    render(<PasswordSecurityRules password="a" />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')

    expect(checkIcons).toHaveLength(1)

    const closeIcons = screen.getAllByTestId('rule-icon-close')

    expect(closeIcons).toHaveLength(4)
  })

  it('should validate number rule', () => {
    render(<PasswordSecurityRules password="1" />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')

    expect(checkIcons).toHaveLength(1)

    const closeIcons = screen.getAllByTestId('rule-icon-close')

    expect(closeIcons).toHaveLength(4)
  })

  it('should validate special character rule', () => {
    render(<PasswordSecurityRules password="!" />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')

    expect(checkIcons).toHaveLength(1)

    const closeIcons = screen.getAllByTestId('rule-icon-close')

    expect(closeIcons).toHaveLength(4)
  })

  it('should validate every rule if password is correct', () => {
    render(<PasswordSecurityRules password="ABCDefgh1234!!!!" />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')

    expect(checkIcons).toHaveLength(5)
  })

  it('should unvalidate the following invalid passwords', () => {
    const invalidPasswords = [
      't00::5H0rt@',
      'n0upper_c4s3^letter',
      'NO-LOWER_CASE.L3TT3R',
      'MIXED.case-WITHOUT_digits',
      'MIXEDcaseWITHOUTSP3C14lchars',
    ]
    invalidPasswords.forEach((password) => {
      expect(isPasswordCorrect(password)).not.toBe(true)
    })
  })

  it('should validate the following valid passwords', () => {
    const validPasswords = [
      '-v4l1dP455sw0rd',
      '&v4l1dP455sw0rd',
      '?v4l1dP455sw0rd',
      '~v4l1dP455sw0rd',
      '#v4l1dP455sw0rd',
      '|v4l1dP455sw0rd',
      '^v4l1dP455sw0rd',
      '@v4l1dP455sw0rd',
      '=v4l1dP455sw0rd',
      '+v4l1dP455sw0rd',
      '$v4l1dP455sw0rd',
      '<v4l1dP455sw0rd',
      '>v4l1dP455sw0rd',
      '%v4l1dP455sw0rd',
      '*v4l1dP455sw0rd',
      '!v4l1dP455sw0rd',
      ':v4l1dP455sw0rd',
      ';v4l1dP455sw0rd',
      ',v4l1dP455sw0rd',
      '.v4l1dP455sw0rd',
      '{v4l1dP455sw0rd',
      '}v4l1dP455sw0rd',
      '(v4l1dP455sw0rd',
      ')v4l1dP455sw0rd',
      '\\v4l1dP455sw0rd',
      '/v4l1dP455sw0rd',
      '"v4l1dP455sw0rd',
      "'v4l1dP455sw0rd",
      '[v4l1dP455sw0rd',
      ']v4l1dP455sw0rd',
      '`v4l1dP455sw0rd',
    ]
    validPasswords.forEach((password) => {
      expect(isPasswordCorrect(password)).toBe(true)
    })
  })
})
