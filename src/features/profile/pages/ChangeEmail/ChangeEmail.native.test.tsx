import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, superFlushWithAct, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ChangeEmail } from './ChangeEmail'

jest.mock('features/auth/context/AuthContext')
jest.useFakeTimers()

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<ChangeEmail/>', () => {
  beforeEach(simulateUpdateEmailSuccess)

  it('should render correctly', () => {
    const renderAPI = renderChangeEmail()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render and log correctly when an email change is already in progress', async () => {
    simulateCurrentEmailChange()
    const renderAPI = renderChangeEmail()
    await superFlushWithAct()

    expect(renderAPI).toMatchSnapshot()

    await waitFor(() => {
      expect(analytics.logConsultDisclaimerValidationMail).toHaveBeenCalledTimes(1)
    })
  })

  it.each`
    password          | email                | isDisabled
    ${'password>=12'} | ${'valid@email.com'} | ${false}
    ${'password>=12'} | ${'invalid@email'}   | ${true}
    ${'password<12'}  | ${'valid@email.com'} | ${true}
    ${'password>=12'} | ${''}                | ${true}
  `(
    'CTA "Enregistrer les modifications" (disabled=$isDisabled) with background color = $backgroundColor if password = "$password" and email = $email',
    async ({ password, email, isDisabled }) => {
      const { getByPlaceholderText, getByLabelText } = renderChangeEmail()
      const submitButton = getByLabelText('Enregistrer les modifications')
      expect(submitButton).toBeDisabled()

      await act(async () => {
        const passwordInput = getByPlaceholderText('Ton mot de passe')
        fireEvent.changeText(passwordInput, password)
      })
      await act(async () => {
        const emailInput = getByPlaceholderText('tonadresse@email.com')
        fireEvent.changeText(emailInput, email)
      })
      expect(submitButton)[isDisabled ? 'toBeDisabled' : 'toBeEnabled']()
    }
  )

  it('should display "same email" error if I entered the same email (case insensitive)', async () => {
    const { getByPlaceholderText, getByLabelText, queryByText } = renderChangeEmail()
    const submitButton = getByLabelText('Enregistrer les modifications')
    expect(submitButton).toBeDisabled()

    await act(async () => {
      const passwordInput = getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'password>=12')
    })
    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'EMAIL@domain.ext')
    })
    expect(submitButton).toBeDisabled()

    await act(async () => {
      await jest.advanceTimersByTime(600)
    })
    const errorMessage = queryByText('L’e-mail saisi est identique à ton e-mail actuel')
    expect(errorMessage).toBeTruthy()
  })

  it('should navigate to Profile and log event if the API call is ok', async () => {
    const { getByPlaceholderText, getByLabelText } = renderChangeEmail()
    const submitButton = getByLabelText('Enregistrer les modifications')
    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'tonadresse@email.com')
    })
    await act(async () => {
      const passwordInput = getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'password>=12')
    })

    await act(async () => {
      fireEvent.press(submitButton)
    })

    expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
    expect(mockShowSuccessSnackBar).toBeCalledWith({
      message:
        'E-mail envoyé\u00a0! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.',
      timeout: 5000,
    })
    expect(analytics.logSaveNewMail).toHaveBeenCalledTimes(1)
  })

  it('should show error message if the user gave a wrong password', async () => {
    simulateUpdateEmailError(CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD)

    const { getByPlaceholderText, getByLabelText, queryByText } = renderChangeEmail()
    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'tonadresse@email.com')
    })

    await act(async () => {
      const passwordInput = getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'password>=12')
    })

    await act(async () => {
      const submitButton = getByLabelText('Enregistrer les modifications')
      fireEvent.press(submitButton)
    })

    expect(navigate).not.toBeCalled()
    const errorMessage = queryByText('Mot de passe incorrect')
    expect(errorMessage).toBeTruthy()
    expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
      CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD
    )
  })

  it('should show the generic error message if the API call returns an attempts limit error', async () => {
    simulateUpdateEmailError(CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT)

    const { getByPlaceholderText, getByLabelText } = renderChangeEmail()
    const submitButton = getByLabelText('Enregistrer les modifications')
    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'tonadresse@email.com')
    })
    await act(async () => {
      const passwordInput = getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'password>=12')
    })

    await act(async () => {
      fireEvent.press(submitButton)
    })

    expect(navigate).not.toBeCalled()
    expect(mockShowErrorSnackBar).toBeCalledWith({
      message: `Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.`,
      timeout: 5000,
    })
    expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
      CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT
    )
  })
})

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderChangeEmail = () => render(reactQueryProviderHOC(<ChangeEmail />))

function simulateUpdateEmailSuccess() {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/profile/update_email', async (_, res, ctx) =>
      res.once(ctx.status(200))
    )
  )
}

function simulateUpdateEmailError(code: CHANGE_EMAIL_ERROR_CODE) {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/profile/update_email', async (_, res, ctx) =>
      res.once(ctx.status(400), ctx.json({ code }))
    )
  )
}

function simulateCurrentEmailChange() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/profile/token_expiration', async (_, res, ctx) =>
      res.once(ctx.status(200), ctx.json({ expiration: '2021-12-07T13:45:05.812190' }))
    )
  )
}
