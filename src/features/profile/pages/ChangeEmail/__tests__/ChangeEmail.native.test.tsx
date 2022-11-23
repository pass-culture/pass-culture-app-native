import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/api'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ChangeEmail } from '../ChangeEmail'

jest.mock('features/profile/api')
jest.mock('react-query')
const mockedUseMutation = mocked(useMutation)
const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onSuccess }) => ({
    mutationFunction,
    mutationOptions: { onSuccess },
    mutate: () => onSuccess(),
  }))
}
mockUseMutationSuccess()

const mockUseMutationError = (code: CHANGE_EMAIL_ERROR_CODE) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onError }) => ({
    mutationFunction,
    mutationOptions: { onError },
    mutate: () => {
      onError({ content: { code } })
    },
  }))
}

const mockedUseQuery = mocked(useQuery)
const mockUseQueryWithoutExpirationTimestamp = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseQuery.mockImplementationOnce(() => ({}))
}
mockUseQueryWithoutExpirationTimestamp()
const mockUseQueryWithExpirationTimestamp = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseQuery.mockImplementationOnce(() => ({
    data: { expiration: '2021-12-07T13:45:05.812190' },
  }))
}

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
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should render and log correctly when an email change is already in progress', async () => {
    mockUseQueryWithExpirationTimestamp()
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()

    await waitForExpect(() => {
      expect(analytics.logConsultDisclaimerValidationMail).toBeCalled()
    })

    mockUseQueryWithoutExpirationTimestamp()
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
      const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
      const submitButton = getByTestId('Enregistrer les modifications')
      expect(submitButton).toBeDisabled()

      const passwordInput = getByPlaceholderText('Ton mot de passe')
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(passwordInput, password)
      fireEvent.changeText(emailInput, email)

      await waitForExpect(() => {
        expect(submitButton)[isDisabled ? 'toBeDisabled' : 'toBeEnabled']()
      })
    }
  )

  it('should display "same email" error if I entered the same email (case insensitive)', async () => {
    const { getByPlaceholderText, getByTestId, queryByText } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
    expect(submitButton).toBeDisabled()

    const passwordInput = getByPlaceholderText('Ton mot de passe')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')
    fireEvent.changeText(emailInput, 'EMAIL@domain.ext')

    await waitForExpect(() => {
      expect(submitButton).toBeDisabled()

      const errorMessage = queryByText('L’e-mail saisi est identique à ton e-mail actuel')
      expect(errorMessage).toBeTruthy()
    })
  })

  it('should navigate to Profile and log event if the API call is ok', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message:
          'E-mail envoyé\u00a0! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.',
        timeout: 5000,
      })
      expect(analytics.logSaveNewMail).toBeCalled()
    })
  })

  it('should show error message if the user gave a wrong password', async () => {
    mockUseMutationError(CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD)

    const { getByPlaceholderText, getByTestId, queryByText } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      const errorMessage = queryByText('Mot de passe incorrect')
      expect(errorMessage).toBeTruthy()
      expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
        CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD
      )
    })

    mockUseMutationSuccess()
  })

  it('should show the generic error message if the API call returns an attempts limit error', async () => {
    mockUseMutationError(CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT)

    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.`,
        timeout: 5000,
      })
      expect(analytics.logErrorSavingNewEmail).toHaveBeenCalledWith(
        CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT
      )
    })

    mockUseMutationSuccess()
  })
})
