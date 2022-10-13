import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { ChangePasswordRequest } from 'api/gen'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromisesWithAct, superFlushWithAct, render, fireEvent, act } from 'tests/utils'
import { theme } from 'theme'
import { showSuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { ChangePassword } from '../ChangePassword'

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))

async function renderChangePassword() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  const wrapper = render(reactQueryProviderHOC(<ChangePassword />))
  await flushAllPromisesWithAct()
  return wrapper
}

describe('ChangePassword', () => {
  it('should enable the submit button when passwords are equals and filled and current password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    })
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = getByTestId('Enregistrer')
    expect(continueButton).toBeEnabled()
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, getByText } = await renderChangePassword()

    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, '123456')
    })

    await act(async () => {
      fireEvent.changeText(confirmationInput, '123456--')
    })

    const notMatchingErrorText = getByText('Les mots de passe ne concordent pas')

    const color = notMatchingErrorText.props.style[0].color
    expect(color).toEqual(theme.colors.error)
  })

  it('should validate PasswordSecurityRules when password is correct', async () => {
    const renderAPI = await renderChangePassword()

    const notValidatedRulesSnapshot = renderAPI.toJSON()

    const passwordInput = renderAPI.getByPlaceholderText('Ton nouveau mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')
    })

    await waitForExpect(() => {
      const validatedRulesSnapshot = renderAPI.toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })

  it('should display success snackbar and navigate to Profile when the password is updated', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(200), ctx.json({}))
      )
    )
    // eslint-disable-next-line local-rules/independent-mocks
    mockedUseSnackBarContext.mockImplementation(() => ({
      showSuccessSnackBar,
    }))

    const { getByPlaceholderText, getByTestId } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    })
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await superFlushWithAct()

    fireEvent.press(getByTestId('Enregistrer'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(showSuccessSnackBar).toBeCalledWith({
        message: 'Ton mot de passe est modifié',
        timeout: SNACK_BAR_TIME_OUT,
      })
      expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
      expect(analytics.logHasChangedPassword).toBeCalledWith('changePassword')
    })
  })

  it('display error when the password failed to updated', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(400), ctx.json({}))
      )
    )
    const { getByPlaceholderText, getByTestId, queryByText } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    })
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = getByTestId('Enregistrer')

    await act(async () => {
      fireEvent.press(continueButton)
    })

    await superFlushWithAct()

    await waitForExpect(() => {
      expect(queryByText('Mot de passe incorrect')).toBeTruthy()
    })

    await act(async () => {
      fireEvent.changeText(currentPasswordInput, 'user@QWERTY123')
    })

    await waitForExpect(() => {
      expect(queryByText('Mot de passe incorrect')).toBeNull()
    })
  })
})
