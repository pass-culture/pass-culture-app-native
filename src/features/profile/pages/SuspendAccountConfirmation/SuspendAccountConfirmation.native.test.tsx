import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

type useEmailUpdateStatusMock = ReturnType<(typeof useEmailUpdateStatus)['useEmailUpdateStatus']>

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.CANCELLATION,
    },
    isLoading: false,
  } as useEmailUpdateStatusMock)

jest.mock('features/navigation/helpers/navigateToHome')

const emailUpdateCancelSpy = jest
  .spyOn(API.api, 'postNativeV1ProfileEmailUpdateCancel')
  .mockImplementation()

const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const navigation = {
  navigate: jest.fn(),
  reset: jest.fn(),
} as unknown as NativeStackNavigationProp<RootStackParamList, 'SuspendAccountConfirmation'>

const route = {
  params: {
    token: 'example',
  },
} as unknown as RouteProp<RootStackParamList, 'SuspendAccountConfirmation'>

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<SuspendAccountConfirmation />', () => {
  describe('should navigate to home', () => {
    it('When there is no email change', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
      } as useEmailUpdateStatusMock)
      renderSuspendAccountConfirmation()

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
      } as useEmailUpdateStatusMock)
      renderSuspendAccountConfirmation()

      fireEvent.press(screen.getByText('Ne pas suspendre mon compte'))

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('When pressing "Oui, suspendre mon compte" button and API response is error and is not a 401 error', async () => {
      emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
      renderSuspendAccountConfirmation()

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
    } as useEmailUpdateStatusMock)
    renderSuspendAccountConfirmation()

    expect(screen.getByText('Souhaites-tu suspendre ton compte pass Culture ?')).toBeOnTheScreen()
    expect(screen.getByText('Oui, suspendre mon compte')).toBeOnTheScreen()
    expect(screen.getByText('Ne pas suspendre mon compte')).toBeOnTheScreen()
  })

  it('should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success', async () => {
    renderSuspendAccountConfirmation()
    fireEvent.press(screen.getByText('Oui, suspendre mon compte'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is error and is not 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
    renderSuspendAccountConfirmation()

    await act(async () => {
      fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
    renderSuspendAccountConfirmation()

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
      } as useEmailUpdateStatusMock)
      renderSuspendAccountConfirmation()

      expect(navigation.reset).toHaveBeenNthCalledWith(1, {
        routes: [{ name: 'ChangeEmailExpiredLink' }],
      })
    })

    it('When pressing "Confirmer la demande" button and API response is a 401 error', async () => {
      emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
      renderSuspendAccountConfirmation()

      await act(async () => {
        fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
      })

      expect(navigation.reset).toHaveBeenNthCalledWith(1, {
        routes: [{ name: 'ChangeEmailExpiredLink' }],
      })
    })
  })
})

const renderSuspendAccountConfirmation = () =>
  render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
