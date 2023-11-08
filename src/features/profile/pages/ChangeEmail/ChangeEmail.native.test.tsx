import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { UpdateEmailTokenExpiration } from 'api/gen'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, superFlushWithAct } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ChangeEmail } from './ChangeEmail'

jest.mock('features/auth/context/AuthContext')
jest.useFakeTimers({ legacyFakeTimers: true })

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

describe('<ChangeEmail/>', () => {
  beforeEach(() => {
    mockServer.getApiV1<UpdateEmailTokenExpiration>('/profile/token_expiration', {
      expiration: undefined,
    })
    simulateUpdateEmailSuccess()
  })

  it('should render correctly', async () => {
    renderChangeEmail()

    await screen.findByText('Modifier mon e-mail')

    expect(screen).toMatchSnapshot()
  })

  it('should show email suggestion', async () => {
    renderChangeEmail()
    await fillInputs({ email: 'user@gmal.com' })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.queryByText('Veux-tu plutôt dire user@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  describe('email change already in progress', () => {
    const alreadyInProgressText =
      'Une demande a été envoyée à ta nouvelle adresse. Tu as 24h pour la valider. Pense à vérifier tes spams.'

    it('should render correctly', async () => {
      simulateCurrentEmailChange()
      renderChangeEmail()
      await screen.findByText(alreadyInProgressText)

      expect(screen).toMatchSnapshot()
    })

    it('should log analytics', async () => {
      simulateCurrentEmailChange()
      renderChangeEmail()
      await screen.findByText(alreadyInProgressText)

      expect(analytics.logConsultDisclaimerValidationMail).toHaveBeenCalledTimes(1)
    })
  })

  describe('submit button', () => {
    it('should be disabled by default', async () => {
      renderChangeEmail()
      await act(async () => {})

      const submitButton = await screen.findByLabelText('Enregistrer les modifications')

      expect(submitButton).toBeDisabled()
    })

    it('should be enabled when form is valid', async () => {
      renderChangeEmail()
      const submitButton = screen.getByLabelText('Enregistrer les modifications')

      await fillInputs({ email: 'valid@email.com', password: 'password>=12' })

      expect(submitButton).toBeEnabled()
    })

    it.each`
      password          | email
      ${'password>=12'} | ${'invalid@email'}
      ${'password<12'}  | ${'valid@email.com'}
      ${'password>=12'} | ${''}
    `('should be disabled when form is invalid', async ({ password, email }) => {
      renderChangeEmail()
      const submitButton = screen.getByLabelText('Enregistrer les modifications')

      await fillInputs({ email, password })

      expect(submitButton).toBeDisabled()
    })
  })

  describe('When email change succeeds', () => {
    it('should navigate to Profile', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    })

    it('should show success snackbar', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message:
          'E-mail envoyé\u00a0! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should log analytics', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(analytics.logSaveNewMail).toHaveBeenCalledTimes(1)
    })
  })

  it('should display "same email" error if I entered the same email (case insensitive)', async () => {
    renderChangeEmail()
    const submitButton = screen.getByLabelText('Enregistrer les modifications')

    await fillInputs({ email: 'EMAIL@domain.ext' })

    expect(submitButton).toBeDisabled()

    act(() => {
      jest.advanceTimersByTime(600)
    })

    const errorMessage = screen.queryByText('L’e-mail saisi est identique à ton e-mail actuel')

    expect(errorMessage).toBeOnTheScreen()
  })

  describe('When user gives wrong password', () => {
    beforeEach(() => simulateUpdateEmailError(CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD))

    it('should not navigate', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should show error message', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      const errorMessage = screen.queryByText('Mot de passe incorrect')

      expect(errorMessage).toBeOnTheScreen()
    })

    it('should log analytics', async () => {
      renderChangeEmail()

      await fillInputs({})

      await submitForm()

      expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
        CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD
      )
    })
  })

  describe('When user has reached attempts limit', () => {
    beforeEach(() => simulateUpdateEmailError(CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT))

    it('should not navigate', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should show the generic error message', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: `Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should log analytics', async () => {
      renderChangeEmail()
      await fillInputs({})
      await submitForm()

      expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
        CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT
      )
    })
  })
})

const renderChangeEmail = () => render(reactQueryProviderHOC(<ChangeEmail />))

const fillInputs = async ({ email, password }: { email?: string; password?: string }) => {
  const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
  fireEvent.changeText(passwordInput, password ?? 'password>=12')

  const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
  fireEvent.changeText(emailInput, email ?? 'tonadresse@email.com')

  // To avoid CI flakiness
  await superFlushWithAct()
}

const submitForm = async () => {
  const submitButton = screen.getByLabelText('Enregistrer les modifications')
  fireEvent.press(submitButton)

  // To avoid CI flakiness
  await superFlushWithAct()
}

function simulateUpdateEmailSuccess() {
  mockServer.postApiV1('/profile/update_email', {})
}

function simulateUpdateEmailError(code: CHANGE_EMAIL_ERROR_CODE) {
  mockServer.postApiV1('/profile/update_email', {
    responseOptions: { statusCode: 400, data: { code } },
  })
}

function simulateCurrentEmailChange() {
  mockServer.getApiV1('/profile/token_expiration', {
    expiration: '2021-12-07T13:45:05.812190',
  })
}
