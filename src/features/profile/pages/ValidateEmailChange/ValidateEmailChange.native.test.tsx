import { RouteProp } from '@react-navigation/native'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailHistoryEventTypeEnum, EmailUpdateStatusResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'
import { RootStackParamList, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'
import { eventMonitoring } from 'libs/monitoring/services'
import { render, screen, userEvent } from 'tests/utils'

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      newEmail: 'john@doe.com',
      expired: false,
      status: EmailHistoryEventTypeEnum.VALIDATION,
    },
  } as UseQueryResult<EmailUpdateStatusResponse>)

jest.mock('features/navigation/helpers/navigateToHome')

const mockShowSuccessSnackbar = jest.fn()
const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackbar,
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

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

const navigation = {
  reset: jest.fn(),
  replace: jest.fn(),
} as unknown as NativeStackNavigationProp<
  RootStackParamList & ProfileStackParamList,
  'ValidateEmailChange'
>

type RootAndProfileRouteProp = RouteProp<
  RootStackParamList & ProfileStackParamList,
  'ValidateEmailChange'
>
const route = {
  params: {
    token: 'example',
  },
} as unknown as RootAndProfileRouteProp
const routeWithUndefinedToken = {
  params: {
    token: undefined,
  },
} as unknown as RootAndProfileRouteProp

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ValidateEmailChange', () => {
  it('should render new email address', () => {
    renderValidateEmailChange()

    expect(screen.getByText('john@doe.com')).toBeOnTheScreen()
  })

  it('should sign out if submit is success and user is logged in', async () => {
    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('should not sign out if submit is success and user is not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      isUserLoading: false,
      refetchUser: jest.fn(),
    })
    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('should redirect to Login if submit is success', async () => {
    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(navigation.reset).toHaveBeenNthCalledWith(1, {
      routes: [{ name: 'Login', params: { from: StepperOrigin.VALIDATE_EMAIL_CHANGE } }],
    })
  })

  it('should display a snackbar if submit is success', async () => {
    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(mockShowSuccessSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should redirect to ChangeEmailExpiredLink if submit triggers a 401 error', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))

    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(navigation.reset).toHaveBeenCalledWith({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
  })

  it('should display an error message if submit triggers an error not 401', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(500, 'unauthorized'))

    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error message if submit triggers an error  401', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))

    renderValidateEmailChange()

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(mockShowErrorSnackbar).not.toHaveBeenCalled()
  })

  it('should redirect to change email expired when status is expired', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: 'john@doe.com',
        status: EmailHistoryEventTypeEnum.VALIDATION,
      },
    } as UseQueryResult<EmailUpdateStatusResponse>)

    renderValidateEmailChange()

    expect(navigation.reset).toHaveBeenNthCalledWith(1, {
      routes: [{ name: 'ChangeEmailExpiredLink' }],
    })
  })

  it('should redirect to home when there is no email update', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: undefined,
    } as UseQueryResult<EmailUpdateStatusResponse>)

    renderValidateEmailChange()

    expect(navigation.replace).toHaveBeenCalledWith(...homeNavigationConfig)
  })

  it('should log to sentry, redirect to home and show error message when token is falsy', async () => {
    renderValidateEmailChange(routeWithUndefinedToken)

    await user.press(screen.getByText('Valider l’adresse e-mail'))

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      new Error('Expected a string, but received undefined')
    )
    expect(navigation.replace).toHaveBeenCalledWith(...homeNavigationConfig)
    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })
})

const renderValidateEmailChange = (routeProp: RootAndProfileRouteProp = route) =>
  render(<ValidateEmailChange navigation={navigation} route={routeProp} />)
