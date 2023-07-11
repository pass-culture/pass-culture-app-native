import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import * as API from 'api/api'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/profile/helpers/useEmailUpdateStatus', () => ({
  useEmailUpdateStatus: jest.fn().mockReturnValue({
    data: {
      newEmail: 'john@doe.com',
    },
  }),
}))
jest.mock('features/navigation/helpers')

const mockShowErrorSnackbar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackbar,
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const emailUpdateConfirmSpy = jest
  .spyOn(API.api, 'postnativev1profileemailUpdateconfirm')
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
    render(<ValidateEmailChange navigation={navigation} route={route} />, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(screen.getByText('john@doe.com')).toBeTruthy()
  })

  it('should redirect to TrackEmailChange if submit is success', async () => {
    render(<ValidateEmailChange navigation={navigation} route={route} />, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'TrackEmailChange')
    })
  })

  it('should display a snackbar redirect to home if submit triggers an error', async () => {
    emailUpdateConfirmSpy.mockRejectedValueOnce('Oops test')

    render(<ValidateEmailChange navigation={navigation} route={route} />, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {
      fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    })

    expect(mockShowErrorSnackbar).toHaveBeenCalledTimes(1)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
    expect(1).toEqual(1)
  })
})
