import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

type UseEmailUpdateStatusMock = ReturnType<typeof useEmailUpdateStatus['useEmailUpdateStatus']>

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.CANCELLATION,
    },
    isLoading: false,
  } as UseEmailUpdateStatusMock)

jest.mock('features/navigation/helpers')
jest.mock('react-query')

const emailUpdateCancelSpy = jest
  .spyOn(API.api, 'postnativev1profileemailUpdatecancel')
  .mockImplementation()

const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<SuspendAccountConfirmation />', () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'SuspendAccountConfirmation'>

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList, 'SuspendAccountConfirmation'>

  describe('should navigate to home', () => {
    it('When there is no email change', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('When pressing "Ne pas suspendre mon compte" button', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<SuspendAccountConfirmation navigation={navigation} route={route} />)

      fireEvent.press(screen.getByText('Ne pas suspendre mon compte'))

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('When pressing "Oui, suspendre mon compte" button and API response is error and is not a 401 error', async () => {
      emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
      render(<SuspendAccountConfirmation navigation={navigation} route={route} />)

      await act(async () => {
        fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
      })

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should display message and buttons when there is current email change', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: '',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
    expect(screen.getByText('Souhaites-tu suspendre ton compte pass Culture ?')).toBeTruthy()
    expect(screen.getByText('Oui, suspendre mon compte')).toBeTruthy()
    expect(screen.getByText('Ne pas suspendre mon compte')).toBeTruthy()
  })

  it('should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success', async () => {
    render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
    fireEvent.press(screen.getByText('Oui, suspendre mon compte'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is error and is not 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
    render(<SuspendAccountConfirmation navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
    render(<SuspendAccountConfirmation navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
    })

    expect(mockShowErrorSnackbar).not.toHaveBeenCalled()
  })

  describe('should navigate to change email expired', () => {
    it('When last email change expired', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: true,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
    })

    it('When pressing "Confirmer la demande" button and API response is a 401 error', async () => {
      emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
      render(<SuspendAccountConfirmation navigation={navigation} route={route} />)

      await act(async () => {
        fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
      })

      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
    })
  })
})
