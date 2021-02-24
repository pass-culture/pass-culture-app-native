import { render, act, fireEvent, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { ChangePasswordRequest } from 'api/gen'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'
import { displaySuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext.ts'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum } from 'ui/theme'

import { ChangePassword } from './ChangePassword'

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))

async function renderChangePassword() {
  const wrapper = render(reactQueryProviderHOC(<ChangePassword />))
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}

describe('ChangePassword', () => {
  it('should enable the submit button when passwords are equals and filled and current password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
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
    const { getByPlaceholderText, getByText } = await renderChangePassword()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    // assuming there's only one button in this page
    const notMatchingErrorText = getByText('les mots de passe ne concordent pas')

    await waitFor(async () => {
      const color = notMatchingErrorText.props.style[0].color
      expect(color).toEqual(ColorsEnum.ERROR)
    })
  })
  it('should validate PasswordSecurityRules when password is correct', async () => {
    const { getByPlaceholderText, toJSON } = await renderChangePassword()

    const notValidatedRulesSnapshot = toJSON()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')

    await waitForExpect(() => {
      const validatedRulesSnapshot = toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })
  it.only('', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(200), ctx.json({}))
      )
    )
    mockedUseSnackBarContext.mockImplementation(() => ({
      displaySuccessSnackBar,
    }))

    const { getByPlaceholderText, getByTestId } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    // assuming there's only one button in this page
    const continueButton = getByTestId('button-container')
    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(displaySuccessSnackBar).toBeCalledWith({
        message: 'Ton mot de passe a été modifié !',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})
