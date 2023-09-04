import React from 'react'
import { useForm, ErrorOption } from 'react-hook-form'

import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { fireEvent, render, screen } from 'tests/utils'

type PasswordForm = {
  password: string
}

describe('<PasswordInputController />', () => {
  describe('by default', () => {
    it('should not show error when password is invalid but not given', async () => {
      renderPasswordInputController({
        error: { type: 'custom', message: 'error' },
      })

      expect(screen.queryByText('error')).not.toBeOnTheScreen()
    })

    it('should show error when form is invalid and password is not empty', async () => {
      renderPasswordInputController({
        error: { type: 'custom', message: 'error' },
      })

      const input = screen.getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(input, 'pass')

      expect(screen.getByText('error')).toBeOnTheScreen()
    })

    it('should show that password is mandatory', async () => {
      renderPasswordInputController({})

      expect(screen.getByText('Obligatoire')).toBeOnTheScreen()
    })

    it('should not show password validation', () => {
      renderPasswordInputController({})

      const input = screen.getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(input, 'user@AZERTY123')

      expect(screen.queryByText('12 Caractères')).not.toBeOnTheScreen()
    })
  })

  describe('With security rules', () => {
    it.each([
      '12 caractères',
      '1 majuscule',
      '1 minuscule',
      '1 chiffre',
      '1 caractère spécial (!@#$%^&*...)',
    ])('should not show password validation rules when empty', (rule) => {
      renderPasswordInputController({ withSecurityRules: true })

      expect(screen.queryByText(rule)).not.toBeOnTheScreen()
    })

    it.each([
      '12 caractères',
      '1 majuscule',
      '1 minuscule',
      '1 chiffre',
      '1 caractère spécial (!@#$%^&*...)',
    ])('should show password validation rules when at least one character is typed', (rules) => {
      renderPasswordInputController({ withSecurityRules: true })

      const input = screen.getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(input, 'a')

      expect(screen.getByText(rules)).toBeOnTheScreen()
    })
  })

  describe('With security rules always displayed', () => {
    it.each([
      '12 caractères',
      '1 majuscule',
      '1 minuscule',
      '1 chiffre',
      '1 caractère spécial (!@#$%^&*...)',
    ])('should show password validation rules', (rules) => {
      renderPasswordInputController({ withSecurityRules: true, securityRulesAlwaysVisible: true })

      expect(screen.getByText(rules)).toBeOnTheScreen()
    })
  })
})

const renderPasswordInputController = ({
  withSecurityRules,
  error,
  securityRulesAlwaysVisible,
}: {
  withSecurityRules?: boolean
  error?: ErrorOption
  securityRulesAlwaysVisible?: boolean
}) => {
  const PasswordForm = () => {
    const { control, setError } = useForm<PasswordForm>({
      defaultValues: { password: '' },
    })

    error && setError('password', error)
    return (
      <PasswordInputController
        control={control}
        name="password"
        withSecurityRules={withSecurityRules}
        securityRulesAlwaysVisible={securityRulesAlwaysVisible}
      />
    )
  }
  render(<PasswordForm />)
}
