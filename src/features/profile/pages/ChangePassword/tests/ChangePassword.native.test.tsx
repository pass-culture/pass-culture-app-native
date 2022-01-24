import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { ChangePasswordRequest } from 'api/gen'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises, superFlushWithAct, render, act, fireEvent } from 'tests/utils'
import { showSuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ChangePassword } from '../ChangePassword'

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))

async function renderChangePassword() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    const continueButton = getByTestId('Enregistrer')

    const background = continueButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.PRIMARY)
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, getByText } = await renderChangePassword()

    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, '123456')
    fireEvent.changeText(confirmationInput, '123456--')

    const notMatchingErrorText = getByText('Les mots de passe ne concordent pas')

    const color = notMatchingErrorText.props.style[0].color
    expect(color).toEqual(ColorsEnum.ERROR)
  })

  it('should validate PasswordSecurityRules when password is correct', async () => {
    const { getByPlaceholderText, toJSON } = await renderChangePassword()

    const notValidatedRulesSnapshot = toJSON()

    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    fireEvent.changeText(passwordInput, 'ABCDefgh1234!!!!')

    await waitForExpect(() => {
      const validatedRulesSnapshot = toJSON()
      expect(notValidatedRulesSnapshot).toMatchDiffSnapshot(validatedRulesSnapshot)
    })
  })

  it('display success snackbar when the password is updated', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(200), ctx.json({}))
      )
    )
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseSnackBarContext.mockImplementation(() => ({
      showSuccessSnackBar,
    }))

    const { getByPlaceholderText, getByTestId } = await renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    await superFlushWithAct()

    fireEvent.press(getByTestId('Enregistrer'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(showSuccessSnackBar).toBeCalledWith({
        message: 'Mot de passe modifié',
        timeout: SNACK_BAR_TIME_OUT,
      })
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

    await fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await fireEvent.changeText(passwordInput, 'user@AZERTY123')
    await fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    const continueButton = getByTestId('Enregistrer')
    fireEvent.press(continueButton)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(queryByText('Mot de passe incorrect')).toBeTruthy()
    })

    await fireEvent.changeText(currentPasswordInput, 'user')
    await waitForExpect(() => {
      expect(queryByText('Mot de passe incorrect')).toBeFalsy()
    })
  })
})
