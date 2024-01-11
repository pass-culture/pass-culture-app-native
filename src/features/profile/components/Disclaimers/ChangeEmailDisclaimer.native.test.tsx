import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { nonBeneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

import { ChangeEmailDisclaimer } from './ChangeEmailDisclaimer'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<ChangeEmailDisclaimer />', () => {
  it('should display the disclaimer without the current user email when no email found', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    render(<ChangeEmailDisclaimer />)

    expect(
      screen.getByText(
        'Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur ton adresse actuelle avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu’une fois par jour.'
      )
    ).toBeOnTheScreen()
  })

  it('should display the disclaimer with the current user email when email found', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      user: nonBeneficiaryUser,
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    render(<ChangeEmailDisclaimer />)

    expect(
      screen.getByText(
        'Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur email@domain.ext avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu’une fois par jour.'
      )
    ).toBeOnTheScreen()
  })
})
