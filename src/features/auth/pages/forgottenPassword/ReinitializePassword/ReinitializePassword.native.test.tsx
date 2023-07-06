import React from 'react'

import { useRoute, navigate, replace } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import * as datesLib from 'libs/dates'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { theme } from 'theme'

import { ReinitializePassword } from './ReinitializePassword'

const ROUTE_PARAMS = {
  email: 'john@.example.com',
  token: 'reerereskjlmkdlsf',
  expiration_timestamp: 45465546445,
}

describe('ReinitializePassword Page', () => {
  beforeAll(() => {
    useRoute.mockReturnValue({ params: ROUTE_PARAMS })
  })

  it('should match snapshot', () => {
    renderReinitializePassword()

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when passwords are equals and filled and password is correct', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    const continueButton = screen.getByText('Continuer')

    await waitFor(async () => {
      expect(continueButton).toBeEnabled()
    })
  })

  it('should display the matching error when the passwords dont match', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    const notMatchingErrorText = screen.getByText('Les mots de passe ne concordent pas')

    await waitFor(async () => {
      const color = notMatchingErrorText.props.style[0].color
      expect(color).toEqual(theme.colors.error)
    })
  })

  it('should redirect to login page WHEN password is reset', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Login')
      expect(analytics.logHasChangedPassword).toBeCalledWith('resetPassword')
    })
  })

  it('should redirect to ResetPasswordExpiredLink when expiration_timestamp is expired', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    jest.spyOn(datesLib, 'isTimestampExpired').mockImplementation(() => true)
    renderReinitializePassword()

    expect(replace).toHaveBeenNthCalledWith(1, 'ResetPasswordExpiredLink', {
      email: ROUTE_PARAMS.email,
    })
    expect(navigate).not.toBeCalled()
    expect(analytics.logHasChangedPassword).not.toBeCalled()
  })
})

function renderReinitializePassword() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<ReinitializePassword />)
  )
}
