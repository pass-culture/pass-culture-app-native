import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { EmailChangeConfirmationResponse } from 'api/gen'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ConfirmChangeEmailContent } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmailContent'
import { EmptyResponse } from 'libs/fetch'
import { getRefreshToken } from 'libs/keychain'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

jest.unmock('libs/keychain')
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

describe('<ConfirmChangeEmail />', () => {
  it('should navigate to home when pressing close button', async () => {
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Fermer')))

    expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
  })

  it('should navigate to new email selection on change email confirmation success', async () => {
    mockServer.postApi<EmailChangeConfirmationResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 200, data: confirmationSuccessResponse },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'NewEmailSelection', { token: 'token' })
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

  it('should redirect to change email expired when change email confirmation fails because the link expired', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/confirm', {
      responseOptions: { statusCode: 401, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContent />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
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
})
