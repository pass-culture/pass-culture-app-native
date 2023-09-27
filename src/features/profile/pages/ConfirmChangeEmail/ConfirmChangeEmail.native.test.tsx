import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('react-query')

type UseEmailUpdateStatusMock = ReturnType<typeof useEmailUpdateStatus['useEmailUpdateStatus']>

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

const emailUpdateConfirmSpy = jest
  .spyOn(API.api, 'postNativeV1ProfileEmailUpdateConfirm')
  .mockImplementation()

const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<ConfirmChangeEmail />', () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'ConfirmChangeEmail'>

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList, 'ConfirmChangeEmail'>

  it('should navigate to home if no email change', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should navigate to change email expired if last email change expired', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: '',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
  })

  it('should display confirmation message and buttons', () => {
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    expect(screen.getByText('Confirmes-tu la demande de changement d’e-mail ?')).toBeOnTheScreen()
    expect(screen.getByText('Confirmer la demande')).toBeOnTheScreen()
    expect(screen.getByText('Fermer')).toBeOnTheScreen()
  })

  it('should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success', async () => {
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    fireEvent.press(screen.getByText('Confirmer la demande'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should redirect to home when pressing "Confirmer la demande" button and and API response is not 401 error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should redirect to change email expired when pressing "Confirmer la demande" button and and API response is 401 error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce(new ApiError(401, 'API error'))
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is not 401 error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(mockShowErrorSnackbar).not.toHaveBeenCalled()
  })
})
