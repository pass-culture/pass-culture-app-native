import React from 'react'

import { PasswordSecurityRules } from 'features/auth/components/PasswordSecurityRules'
import { render, screen } from 'tests/utils/web'

describe('<PasswordSecurityRules />', () => {
  it('should display 5 rules', async () => {
    render(<PasswordSecurityRules password={''} />)
    expect(screen.queryByText('12 Caractères')).toBeTruthy()
    expect(screen.queryByText('1 Majuscule')).toBeTruthy()
    expect(screen.queryByText('1 Minuscule')).toBeTruthy()
    expect(screen.queryByText('1 Chiffre')).toBeTruthy()
    expect(screen.queryByText('1 Caractère spécial (!@#$%^&*...)')).toBeTruthy()
  })

  it('should not validate any rules if input is empty', () => {
    render(<PasswordSecurityRules password={''} />)
    const closeIcons = screen.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(5)
  })

  it('should validate capital rule', () => {
    render(<PasswordSecurityRules password={'A'} />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = screen.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate lowercase rule', () => {
    render(<PasswordSecurityRules password={'a'} />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = screen.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate number rule', () => {
    render(<PasswordSecurityRules password={'1'} />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = screen.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate special character rule', () => {
    render(<PasswordSecurityRules password={'!'} />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(1)
    const closeIcons = screen.getAllByTestId('rule-icon-close')
    expect(closeIcons.length).toBe(4)
  })

  it('should validate every rule if password is correct', () => {
    render(<PasswordSecurityRules password={'ABCDefgh1234!!!!'} />)
    const checkIcons = screen.getAllByTestId('rule-icon-check')
    expect(checkIcons.length).toBe(5)
  })
})
