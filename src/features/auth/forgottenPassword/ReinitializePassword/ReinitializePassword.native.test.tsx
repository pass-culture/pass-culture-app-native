import React from 'react'

import { useRoute, navigate, replace } from '__mocks__/@react-navigation/native'
import * as datesLib from 'libs/dates'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'
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

  it('should enable the submit button when passwords are equals and filled and password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = renderReinitializePassword()
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    const continueButton = getByTestId('Continuer')

    await waitFor(async () => {
      expect(continueButton).toBeEnabled()
    })
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, getByText } = renderReinitializePassword()
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    const notMatchingErrorText = getByText('Les mots de passe ne concordent pas')

    await waitFor(async () => {
      const color = notMatchingErrorText.props.style[0].color
      expect(color).toEqual(theme.colors.error)
    })
  })

  it('should validate PasswordSecurityRules when password is correct', async () => {
    const { toJSON, getByPlaceholderText } = renderReinitializePassword()
    const notValidatedRulesSnapshot = toJSON()
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')

    await waitFor(() => {
      const validatedRulesSnapshot = toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })

  it('should redirect to login page WHEN password is reset', async () => {
    const { getByText, getByPlaceholderText } = renderReinitializePassword()
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    fireEvent.press(getByText('Continuer'))

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
