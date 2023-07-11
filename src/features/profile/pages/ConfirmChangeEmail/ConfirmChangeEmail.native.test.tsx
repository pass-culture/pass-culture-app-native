import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
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
  .spyOn(API.api, 'postnativev1profileemailUpdateconfirm')
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

  it('should navigate to home if no current email change', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: '',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should display confirmation message and buttons', () => {
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    expect(screen.getByText('Confirmes-tu la demande de changement d’e-mail ?')).toBeTruthy()
    expect(screen.getByText('Confirmer la demande')).toBeTruthy()
    expect(screen.getByText('Fermer')).toBeTruthy()
  })

  it('should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success', async () => {
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)
    fireEvent.press(screen.getByText('Confirmer la demande'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should redirect to home when pressing "Confirmer la demande" button and API response is error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce('API error')
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should display an error snackbar when pressing "Confirmer la demande" button and API response is error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce('API error')
    render(<ConfirmChangeEmail navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Confirmer la demande'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })
})
