import React from 'react'

import { ChangeEmailDisclaimerDeprecated } from 'features/profile/components/Disclaimers/ChangeEmailDisclaimerDeprecated'
import { nonBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

describe('<ChangeEmailDisclaimer />', () => {
  it('should display the disclaimer without the current user email when no email found', () => {
    mockAuthContextWithoutUser()
    render(<ChangeEmailDisclaimerDeprecated />)

    expect(
      screen.getByText(
        'Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur ton adresse actuelle avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu’une fois par jour.'
      )
    ).toBeOnTheScreen()
  })

  it('should display the disclaimer with the current user email when email found', () => {
    mockAuthContextWithUser(nonBeneficiaryUser)
    render(<ChangeEmailDisclaimerDeprecated />)

    expect(
      screen.getByText(
        'Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur email@domain.ext avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu’une fois par jour.'
      )
    ).toBeOnTheScreen()
  })
})
