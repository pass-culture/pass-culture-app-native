import React from 'react'

import { navigate, replace, reset, useRoute } from '__mocks__/@react-navigation/native'
import { EmailChangeConfirmationResponse } from 'api/gen'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ConfirmChangeEmailContent } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmailContent'
import { EmptyResponse } from 'libs/fetch'
import { getRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
useRoute.mockReturnValue({ params: { token: 'token' } })

const mockShowErrorSnackBar = jest.fn()
jest.spyOn(SnackBarContextModule, 'useSnackBarContext').mockReturnValue({
  showErrorSnackBar: mockShowErrorSnackBar,
  showInfoSnackBar: jest.fn(),
  showSuccessSnackBar: jest.fn(),
  hideSnackBar: jest.fn(),
})

const confirmationSuccessResponse = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  newEmailSelectionToken: 'token',
}

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ConfirmChangeEmail />', () => {
  beforeEach(() => {
    storage.clear('access_token')
  })

  it('should navigate to home when pressing cancel button', async () => {
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Annuler')))

    expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
  })

  it('should navigate to new email selection on change email confirmation success', async () => {
    mockServer.postApi<EmailChangeConfirmationResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 200, data: confirmationSuccessResponse },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(replace).toHaveBeenNthCalledWith(1, 'TabNavigator', {
      params: {
        params: {
          token: 'token',
        },
        screen: 'NewEmailSelection',
      },
      screen: 'ProfileStackNavigator',
    })
  })

  it("should navigate to password creation on change email confirmation success when user doesn't have a password", async () => {
    mockServer.postApi<EmailChangeConfirmationResponse>('/v2/profile/email_update/confirm', {
      responseOptions: {
        statusCode: 200,
        data: { ...confirmationSuccessResponse, resetPasswordToken: 'reset_password_token' },
      },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(replace).toHaveBeenNthCalledWith(1, 'TabNavigator', {
      params: {
        params: {
          emailSelectionToken: 'token',
          token: 'reset_password_token',
        },
        screen: 'ChangeEmailSetPassword',
      },
      screen: 'ProfileStackNavigator',
    })
  })

  it('should login user on change email confirmation success', async () => {
    mockServer.postApi<EmailChangeConfirmationResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 200, data: confirmationSuccessResponse },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(await storage.readString('access_token')).toEqual('accessToken')
    expect(await getRefreshToken()).toEqual('refreshToken')
  })

  it('should log to sentry if token is falsy', async () => {
    mockServer.postApi<EmailChangeConfirmationResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 200, data: confirmationSuccessResponse },
    })
    useRoute.mockReturnValueOnce({ params: { token: undefined } })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      new Error('Expected a string, but received undefined')
    )
    expect(await storage.readString('access_token')).not.toEqual('accessToken')
  })

  it('should redirect to change email expired when change email confirmation fails because the link expired', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 401, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(reset).toHaveBeenNthCalledWith(1, {
      index: 0,
      routes: [{ name: 'ChangeEmailExpiredLink' }],
    })
  })

  it('should display an error snackbar when change email confirmation fails for unknown reason', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 500, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
  })

  it('should not display an error snackbar when change email confirmation fails because the link expired', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 401, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })

  it('should redirect ChangeEmailExpiredLink when timestamp has expired', async () => {
    useRoute.mockReturnValueOnce({ params: { token: 'token', expiration_timestamp: '1710317714' } })

    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await screen.findByText('Confirmer la demande')

    expect(reset).toHaveBeenNthCalledWith(1, {
      index: 0,
      routes: [{ name: 'ChangeEmailExpiredLink' }],
    })
  })
})
