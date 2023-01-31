import React from 'react'
import { useForm, ErrorOption } from 'react-hook-form'

import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { fireEvent, render, screen } from 'tests/utils'

type PasswordForm = {
  password: string
}

describe('<PasswordInputController />', () => {
  it('should not show error when form is invalid and password is empty', async () => {
    renderPasswordInputController({
      error: { type: 'custom', message: 'error' },
    })

    expect(screen.queryByText('error')).toBeNull()
  })

  it('should show error when form is invalid and password is not empty', async () => {
    renderPasswordInputController({
      error: { type: 'custom', message: 'error' },
    })

    const input = screen.getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(input, 'pass')

    expect(screen.getByText('error')).toBeTruthy()
  })

  it('should show that password is mandatory', async () => {
    renderPasswordInputController({})

    expect(screen.getByText('Obligatoire')).toBeTruthy()
  })

  it.each([
    '12 Caractères',
    '1 Majuscule',
    '1 Minuscule',
    '1 Chiffre',
    '1 Caractère spécial (!@#$%^&*...)',
  ])('should show password validation rules when asked', (rules) => {
    renderPasswordInputController({ withSecurityRules: true })

    expect(screen.getByText(rules)).toBeTruthy()
  })

  it('should not show password validation rules by default', () => {
    renderPasswordInputController({})

    expect(screen.queryByText('12 Caractères')).toBeFalsy()
  })
})

const renderPasswordInputController = ({
  withSecurityRules,
  error,
}: {
  withSecurityRules?: boolean
  error?: ErrorOption
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
      />
    )
  }
  render(<PasswordForm />)
}
