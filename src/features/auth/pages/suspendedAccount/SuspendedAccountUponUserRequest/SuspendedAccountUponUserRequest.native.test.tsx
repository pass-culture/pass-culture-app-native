import React from 'react'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics'
import { EmptyResponse } from 'libs/fetch'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/api/useAccountSuspensionDate', () => ({
  useAccountSuspensionDate: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/navigation/helpers/navigateToHome')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const mockShowErrorSnackBar = jest.fn()
jest.spyOn(SnackBarContextModule, 'useSnackBarContext').mockReturnValue({
  showErrorSnackBar: mockShowErrorSnackBar,
  showInfoSnackBar: jest.fn(),
  showSuccessSnackBar: jest.fn(),
  hideSnackBar: jest.fn(),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SuspendedAccountUponUserRequest />', () => {
  it('should match snapshot', () => {
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to reactivation screen on success', async () => {
    mockServer.postApi('/v1/account/unsuspend', {})
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await act(async () => fireEvent.press(screen.getByText('Réactiver mon compte')))

    expect(replace).toHaveBeenNthCalledWith(1, 'AccountReactivationSuccess')
  })

  it('should log analytics on success', async () => {
    mockServer.postApi('/v1/account/unsuspend', {})
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await act(async () => fireEvent.press(screen.getByText('Réactiver mon compte')))

    expect(analytics.logAccountReactivation).toHaveBeenCalledWith('suspendedaccountuponuserrequest')
  })

  it('should show error snackbar on error', async () => {
    mockServer.postApi('/v1/account/unsuspend', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await act(async () => fireEvent.press(screen.getByText('Réactiver mon compte')))

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
        message: 'Une erreur s’est produite pendant la réactivation.',
        timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should log analytics on error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/account/unsuspend', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await act(async () => fireEvent.press(screen.getByText('Réactiver mon compte')))

    await waitFor(() => {
      expect(analytics.logAccountReactivation).toHaveBeenCalledWith(
        'suspendedaccountuponuserrequest'
      )
    })
  })

  it('should go to home page when clicking on "Retourner à l’accueil" button', async () => {
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    const homeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(
        1,
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })
})
