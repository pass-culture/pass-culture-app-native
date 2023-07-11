import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'
import { QueryObserverResult } from 'react-query'

import * as API from 'api/api'
import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
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

const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

jest.mock('react-query')

const emailUpdateValidateSpy = jest
  .spyOn(API.api, 'putnativev1profileemailUpdatevalidate')
  .mockImplementation()

describe('ValidateEmailChange', () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'ValidateEmailChange'>

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList, 'ValidateEmailChange'>

  it('should render new email address', () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)
    expect(screen.getByText('john@doe.com')).toBeTruthy()
  })

  it('should redirect to TrackEmailChange if submit is success', async () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />)

    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should display a snackbar if submit triggers an error', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce('Oops test')

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should redirect to home if submit triggers an error', async () => {
    emailUpdateValidateSpy.mockRejectedValueOnce('Oops test')

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should redirect to home when status is expired', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: true,
        newEmail: 'john@doe.com',
        status: EmailHistoryEventTypeEnum.VALIDATION,
      },
    } as QueryObserverResult<EmailUpdateStatus>)

    render(<ValidateEmailChange navigation={navigation} route={route} />)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})
