import React from 'react'
import { useMutation } from 'react-query'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { render, screen, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { AfterChangeEmailValidationBuffer } from './AfterChangeEmailValidationBuffer'

jest.mock('react-query')

const mockedUseMutation = jest.mocked(useMutation)
const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onSuccess }) => ({
    mutationFunction,
    mutationOptions: { onSuccess },
    mutate: () => onSuccess(),
  }))
}
mockUseMutationSuccess()

const mockUseMutationError = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onError }) => ({
    mutationFunction,
    mutationOptions: { onError },
    mutate: () => {
      onError()
    },
  }))
}

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: () => mockSignOut,
}))

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({
    isLoggedIn: true,
  }),
}))

describe('<AfterChangeEmailValidationBuffer/>', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expirationTimestamp: 45465546445,
      },
    }))
  })

  it('should render correctly', () => {
    renderPage()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to the login page if the token validation succeeds', async () => {
    mockUseMutationSuccess()
    renderPage()

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message:
          'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
        timeout: 5000,
      })
      expect(navigate).toBeCalledWith('Login')
    })
  })

  it('should navigate to error page if the token validation fails', async () => {
    mockUseMutationError()
    renderPage()

    await waitFor(() => {
      expect(navigate).toBeCalledWith('ChangeEmailExpiredLink')
    })
  })
})

const renderPage = () => render(<AfterChangeEmailValidationBuffer />)
