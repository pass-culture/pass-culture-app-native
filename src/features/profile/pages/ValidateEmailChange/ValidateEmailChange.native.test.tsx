import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'
import { QueryObserverResult } from 'react-query'

import * as API from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      newEmail: 'john@doe.com',
      expired: false,
      status: EmailHistoryEventTypeEnum.VALIDATION,
    },
  } as QueryObserverResult<EmailUpdateStatus>)

jest.mock('features/navigation/helpers')

const mockShowSuccessSnackbar = jest.fn()
const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackbar,
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: () => mockSignOut,
}))

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
})

const emailUpdateValidateSpy = jest
  .spyOn(API.api, 'putNativeV1ProfileEmailUpdateValidate')
  .mockImplementation()

describe('ValidateEmailChange', () => {
  const navigation = {
    navigate: jest.fn(),
    replace: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'ValidateEmailChange'>

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList, 'ValidateEmailChange'>

  it('should render new email address', () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)
    expect(screen.getByText('john@doe.com')).toBeOnTheScreen()
  })

  it('should sign out if submit is success and user is logged in', async () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)

    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it('should not sign out if submit is success and user is not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    render(<ValidateEmailChange navigation={navigation} route={route} />)

    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))

    await waitFor(() => {
      expect(mockSignOut).not.toHaveBeenCalled()
    })
  })

  it('should redirect to Login if submit is success', async () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(navigation.replace).toHaveBeenNthCalledWith(1, 'Login')
  })

  it('should display a snackbar if submit is success', async () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(mockShowSuccessSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should redirect to ChangeEmailExpiredLink if submit triggers a 401 error', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(navigation.navigate).toHaveBeenCalledWith('ChangeEmailExpiredLink')
  })

  it('should display an error message if submit triggers an error not 401', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(500, 'unauthorized'))

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error message if submit triggers an error  401', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(mockShowErrorSnackbar).not.toHaveBeenCalled()
  })

  it('should redirect to change email expired when status is expired', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: 'john@doe.com',
        status: EmailHistoryEventTypeEnum.VALIDATION,
      },
    } as QueryObserverResult<EmailUpdateStatus>)

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
  })

  it('should redirect to home when there is no email update', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: undefined,
    } as QueryObserverResult<EmailUpdateStatus>)

    render(<ValidateEmailChange navigation={navigation} route={route} />)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})
