import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { ColorsEnum } from 'ui/theme'

import { ReinitializePassword } from './ReinitializePassword'

describe('ReinitializePassword Page', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expiration_timestamp: 45465546445,
      },
    }))
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should enable the submit button when passwords are equals and filled and password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      reactQueryProviderHOC(<ReinitializePassword />)
    )

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    // assuming there's only one button in this page
    const continueButton = getByTestId('button-container')

    await waitFor(async () => {
      const background = continueButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, getByText } = render(
      reactQueryProviderHOC(<ReinitializePassword />)
    )

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    const notMatchingErrorText = getByText('les mots de passe ne concordent pas')

    await waitFor(async () => {
      const color = notMatchingErrorText.props.style[0].color
      expect(color).toEqual(ColorsEnum.ERROR)
    })
  })

  it('should validate PasswordSecurityRules when password is correct', async () => {
    const { toJSON, getByPlaceholderText } = render(reactQueryProviderHOC(<ReinitializePassword />))

    const notValidatedRulesSnapshot = toJSON()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')

    await waitForExpect(() => {
      const validatedRulesSnapshot = toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })

  it('should redirect to login page WHEN password is reset', async () => {
    const { getByText } = render(reactQueryProviderHOC(<ReinitializePassword />))

    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('Login')
    })
  })
})
