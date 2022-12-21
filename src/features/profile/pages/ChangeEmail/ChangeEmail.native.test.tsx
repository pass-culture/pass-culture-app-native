import React from 'react'
import { useMutation, useQuery } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ChangeEmail } from './ChangeEmail'

jest.mock('react-query')
jest.mock('features/auth/AuthContext')
const mockedUseMutation = useMutation as jest.Mock
const mockedUseQuery = useQuery as jest.Mock

const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onSuccess }) => ({
    mutationFunction,
    mutationOptions: { onSuccess },
    mutate: () => onSuccess(),
  }))
}

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
  beforeEach(() => {
    mockedUseQuery.mockImplementation(() => ({}))
    mockUseMutationSuccess()
  })
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should render and log correctly when an email change is already in progress', async () => {
    mockUseQueryWithExpirationTimestamp()
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()

    await waitForExpect(() => {
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
      const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
      const submitButton = getByTestId('Enregistrer les modifications')
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
    const { getByPlaceholderText, getByTestId, queryByText } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
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

    const errorMessage = queryByText('L’e-mail saisi est identique à ton e-mail actuel')
    expect(errorMessage).toBeTruthy()
  })

  it('should navigate to Profile and log event if the API call is ok', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
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
    mockUseMutationError(CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD)

    const { getByPlaceholderText, getByTestId, queryByText } = render(<ChangeEmail />)
    await act(async () => {
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'tonadresse@email.com')
    })

    await act(async () => {
      const passwordInput = getByPlaceholderText('Ton mot de passe')
      fireEvent.changeText(passwordInput, 'password>=12')
    })

    await act(async () => {
      const submitButton = getByTestId('Enregistrer les modifications')
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
    mockUseMutationError(CHANGE_EMAIL_ERROR_CODE.EMAIL_UPDATE_ATTEMPTS_LIMIT)

    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer les modifications')
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
