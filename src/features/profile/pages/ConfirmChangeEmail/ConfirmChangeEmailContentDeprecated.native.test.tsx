import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ConfirmChangeEmailContentDeprecated } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmailContentDeprecated'
import { EmptyResponse } from 'libs/fetch'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/navigation/helpers/navigateToHome')

type UseEmailUpdateStatusMock = ReturnType<(typeof useEmailUpdateStatus)['useEmailUpdateStatus']>

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    },
    isLoading: false,
  } as UseEmailUpdateStatusMock)

const mockShowErrorSnackBar = jest.fn()
jest.spyOn(SnackBarContextModule, 'useSnackBarContext').mockReturnValue({
  showErrorSnackBar: mockShowErrorSnackBar,
  showInfoSnackBar: jest.fn(),
  showSuccessSnackBar: jest.fn(),
  hideSnackBar: jest.fn(),
})

useRoute.mockReturnValue({ params: { token: 'token' } })

jest.mock('libs/firebase/analytics/analytics')

describe('<ConfirmChangeEmailDeprecated />', () => {
  it('should navigate to change email expired if last email change expired', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: '',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    expect(navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
  })

  it('should navigate to home when pressing cancel button', () => {
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    fireEvent.press(screen.getByText('Annuler'))

    expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
  })

  it('should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success', async () => {
    mockServer.postApi<EmptyResponse>('/v1/profile/email_update/confirm', {
      responseOptions: { statusCode: 204 },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
  })

  it('should redirect to home when pressing "Confirmer la demande" button and and API response is not 401 error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/profile/email_update/confirm', {
      responseOptions: { statusCode: 500, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should redirect to change email expired when pressing "Confirmer la demande" button and and API response is 401 error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/profile/email_update/confirm', {
      responseOptions: { statusCode: 401, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is not 401 error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/profile/email_update/confirm', {
      responseOptions: { statusCode: 500, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
  })

  it('should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/profile/email_update/confirm', {
      responseOptions: { statusCode: 401, data: {} },
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmailContentDeprecated />))

    await act(async () => fireEvent.press(screen.getByText('Confirmer la demande')))

    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })
})
