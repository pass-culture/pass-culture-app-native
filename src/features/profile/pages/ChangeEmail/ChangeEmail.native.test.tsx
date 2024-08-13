import React from 'react'

import { useRoute, navigate } from '__mocks__/@react-navigation/native'
import { UpdateEmailTokenExpiration } from 'api/gen'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SNACK_BAR_TIME_OUT, SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ChangeEmail } from './ChangeEmail'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.useFakeTimers()

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<ChangeEmail/>', () => {
  beforeEach(() => {
    mockServer.getApi<UpdateEmailTokenExpiration>('/v1/profile/token_expiration', {
      expiration: undefined,
    })
    simulateUpdateEmailSuccess()
  })

  it('should render correctly', async () => {
    renderChangeEmail()

    await screen.findByText('Modifier mon e-mail')

    expect(screen).toMatchSnapshot()
  })

  describe('from DeleteProfileReason', () => {
    it('should show DeleteProfileReasonNewEmailModal when showModal params is set to true', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(screen.getByText('Modifie ton adresse e-mail sur ce compte')).toBeOnTheScreen()
    })

    it('should not show DeleteProfileReasonNewEmailModal when showModal params is set to false', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: false } })
      renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
    })

    it('should hide DeleteProfileReasonNewEmailModal when clicking on "Fermer la modale"', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      renderChangeEmail()

      const closeButton = screen.getByLabelText('Fermer la modale')
      fireEvent.press(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
      })
    })
  })

  it('should not display the update app banner when FF (disableOldChangeEmail) is disabled', async () => {
    renderChangeEmail()

    await screen.findByText('Modifier mon e-mail')

    const updateAppBanner = screen.queryByText(
      'Tu dois mettre à jour ton application pour pouvoir modifier ton adresse e-mail'
    )

    expect(updateAppBanner).not.toBeOnTheScreen()
  })

  it('should show email suggestion', async () => {
    renderChangeEmail()
    await fillInputs({ email: 'user@gmal.com' })

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.getByText('Veux-tu plutôt dire user@gmail.com\u00a0?')).toBeOnTheScreen()
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

      await screen.findByText('Modifier mon e-mail')

      const submitButton = await screen.findByLabelText(
        'Valider la demande de modification de mon e-mail'
      )

      expect(submitButton).toBeDisabled()
    })

    it('should be enabled when form is valid', async () => {
      renderChangeEmail()
      const submitButton = screen.getByLabelText('Valider la demande de modification de mon e-mail')

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
      const submitButton = screen.getByLabelText('Valider la demande de modification de mon e-mail')

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
          'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
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
    const submitButton = screen.getByLabelText('Valider la demande de modification de mon e-mail')

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

  describe('when FF disableOldChangeEmail is active and FF enableNewChangeEmail is inactive', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting disableOldChangeEmail for first render
      useFeatureFlagSpy.mockReturnValueOnce(false) // setting enableNewChangeEmail for first render
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting disableOldChangeEmail for second render because of useCheckHasCurrentEmailChange
      useFeatureFlagSpy.mockReturnValueOnce(false) // setting enableNewChangeEmail for second render because of useCheckHasCurrentEmailChange
    })

    it('should display the update app banner', async () => {
      renderChangeEmail()

      const updateAppBanner = await screen.findByText(
        'Tu dois mettre à jour ton application pour pouvoir modifier ton adresse e-mail'
      )

      expect(updateAppBanner).toBeOnTheScreen()
    })

    it('should disable the email input', async () => {
      renderChangeEmail()

      const emailInput = await screen.findByPlaceholderText('email@exemple.com')

      expect(emailInput).toBeDisabled()
    })

    it('should disable the password input', async () => {
      renderChangeEmail()

      const passwordInput = await screen.findByPlaceholderText('Ton mot de passe')

      expect(passwordInput).toBeDisabled()
    })

    it('should disable the submit button when form is valid', async () => {
      renderChangeEmail()

      await fillInputs({ email: 'valid@email.com', password: 'password>=12' })

      const submitButton = screen.getByLabelText('Valider la demande de modification de mon e-mail')

      expect(submitButton).toBeDisabled()
    })
  })

  describe('when FF enableNewChangeEmail is active and FF disableOldChangeEmail is disabled', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting disableOldChangeEmail for first render
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting enableNewChangeEmail for first render
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting disableOldChangeEmail for second render because of useCheckHasCurrentEmailChange
      useFeatureFlagSpy.mockReturnValueOnce(true) // setting enableNewChangeEmail for second render because of useCheckHasCurrentEmailChange
    })

    it('should display the change email label', async () => {
      renderChangeEmail()

      const fieldLabel = await screen.findByText('Adresse e-mail actuelle')

      expect(fieldLabel).toBeOnTheScreen()
    })

    it('should display the email input', async () => {
      renderChangeEmail()

      const validationButton = await screen.findByTestId(
        'Valider la demande de modification de mon e-mail'
      )

      expect(validationButton).toBeOnTheScreen()
    })
  })
})

const renderChangeEmail = () => render(reactQueryProviderHOC(<ChangeEmail />))

const fillInputs = async ({ email, password }: { email?: string; password?: string }) => {
  const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
  await act(() => {
    fireEvent.changeText(passwordInput, password ?? 'password>=12')
  })
  await act(() => {
    const emailInput = screen.getByPlaceholderText('email@exemple.com')
    fireEvent.changeText(emailInput, email ?? 'email@exemple.com')
  })
}

const submitForm = async () => {
  const submitButton = screen.getByLabelText('Valider la demande de modification de mon e-mail')
  await act(() => {
    fireEvent.press(submitButton)
  })
}

function simulateUpdateEmailSuccess() {
  mockServer.postApi('/v1/profile/update_email', {})
}

function simulateUpdateEmailError(code: CHANGE_EMAIL_ERROR_CODE) {
  mockServer.postApi('/v1/profile/update_email', {
    responseOptions: { statusCode: 400, data: { code } },
  })
}

function simulateCurrentEmailChange() {
  mockServer.getApi<UpdateEmailTokenExpiration>('/v1/profile/token_expiration', {
    expiration: '2021-12-07T13:45:05.812190',
  })
}
