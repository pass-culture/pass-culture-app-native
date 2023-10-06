import React from 'react'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { render } from 'tests/utils'

describe('<PasswordSecurityRules />', () => {
  it('should display 5 rules', async () => {
    const { queryByText } = render(<PasswordSecurityRules password="" />)
    expect(queryByText('12 caractères')).toBeOnTheScreen()
    expect(queryByText('1 majuscule')).toBeOnTheScreen()
    expect(queryByText('1 minuscule')).toBeOnTheScreen()
    expect(queryByText('1 chiffre')).toBeOnTheScreen()
    expect(queryByText('1 caractère spécial (!@#$%^&*...)')).toBeOnTheScreen()
  })

  it('should not validate any rules if input is empty', () => {
    const notValidatedRules = render(<PasswordSecurityRules password="" />)
    const closeIcons = notValidatedRules.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(5)
  })

  it('should validate capital rule', () => {
    const validateCapitalRule = render(<PasswordSecurityRules password="A" />)
    const checkIcons = validateCapitalRule.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = validateCapitalRule.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate lowercase rule', () => {
    const validateLowerCaseRule = render(<PasswordSecurityRules password="a" />)
    const checkIcons = validateLowerCaseRule.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = validateLowerCaseRule.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate number rule', () => {
    const validateNumberRule = render(<PasswordSecurityRules password="1" />)
    const checkIcons = validateNumberRule.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = validateNumberRule.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate special character rule', () => {
    const validateSpecialCharRule = render(<PasswordSecurityRules password="!" />)
    const checkIcons = validateSpecialCharRule.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = validateSpecialCharRule.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate every rule if password is correct', () => {
    const validateEveryRule = render(<PasswordSecurityRules password="ABCDefgh1234!!!!" />)
    const checkIcons = validateEveryRule.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(5)
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
