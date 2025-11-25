import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { ApiError } from 'api/ApiError'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { ProfileStackParamList } from 'features/navigation/navigators/ProfileStackNavigator/types'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import * as useEmailUpdateStatus from 'features/profile/queries/useEmailUpdateStatusQuery'
import { render, screen, userEvent } from 'tests/utils'

type useEmailUpdateStatusMock = ReturnType<
  (typeof useEmailUpdateStatus)['useEmailUpdateStatusQuery']
>

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatusQuery')
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
} as unknown as NativeStackNavigationProp<
  RootStackParamList & ProfileStackParamList,
  'SuspendAccountConfirmation'
>

const route = {
  params: {
    token: 'example',
  },
} as unknown as RouteProp<RootStackParamList & ProfileStackParamList, 'SuspendAccountConfirmation'>

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

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

    it('When pressing "Ne pas suspendre mon compte" button', async () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
        isLoading: false,
      } as useEmailUpdateStatusMock)
      renderSuspendAccountConfirmation()

      await user.press(screen.getByText('Ne pas suspendre mon compte'))

      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })

    it('When pressing "Oui, suspendre mon compte" button and API response is error and is not a 401 error', async () => {
      emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
      renderSuspendAccountConfirmation()

      await user.press(screen.getByText('Oui, suspendre mon compte'))

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
    await user.press(screen.getByText('Oui, suspendre mon compte'))

    expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'ProfileStackNavigator', {
      params: undefined,
      screen: 'TrackEmailChange',
    })
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is error and is not 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(500, 'API error'))
    renderSuspendAccountConfirmation()

    await user.press(screen.getByText('Oui, suspendre mon compte'))

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error', async () => {
    emailUpdateCancelSpy.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
    renderSuspendAccountConfirmation()

    await user.press(screen.getByText('Oui, suspendre mon compte'))

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

      await user.press(screen.getByText('Oui, suspendre mon compte'))

      expect(navigation.reset).toHaveBeenNthCalledWith(1, {
        routes: [{ name: 'ChangeEmailExpiredLink' }],
      })
    })
  })
})

const renderSuspendAccountConfirmation = () =>
  render(<SuspendAccountConfirmation navigation={navigation} route={route} />)
