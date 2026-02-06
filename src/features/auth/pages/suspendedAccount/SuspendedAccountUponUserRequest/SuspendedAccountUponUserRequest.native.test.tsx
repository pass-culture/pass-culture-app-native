import React from 'react'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/queries/useAccountSuspensionDateQuery', () => ({
  useAccountSuspensionDateQuery: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/navigation/helpers/navigateToHome')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SuspendedAccountUponUserRequest />', () => {
  it('should match snapshot', () => {
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to reactivation screen on success', async () => {
    mockServer.postApi('/v1/account/unsuspend', {})
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await user.press(screen.getByText('Réactiver mon compte'))

    expect(replace).toHaveBeenNthCalledWith(1, 'AccountReactivationSuccess')
  })

  it('should log analytics on success', async () => {
    mockServer.postApi('/v1/account/unsuspend', {})
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await user.press(screen.getByText('Réactiver mon compte'))

    expect(analytics.logAccountReactivation).toHaveBeenCalledWith('suspendedaccountuponuserrequest')
  })

  it('should show error snackbar on error', async () => {
    mockServer.postApi('/v1/account/unsuspend', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await user.press(screen.getByText('Réactiver mon compte'))

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(screen.getByText('Une erreur s’est produite pendant la réactivation.')).toBeOnTheScreen()
  })

  it('should log analytics on error', async () => {
    mockServer.postApi<EmptyResponse>('/v1/account/unsuspend', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    await user.press(screen.getByText('Réactiver mon compte'))

    expect(analytics.logAccountReactivation).toHaveBeenCalledWith('suspendedaccountuponuserrequest')
  })

  it('should go to home page when clicking on "Retourner à l’accueil" button', async () => {
    render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))

    const homeButton = screen.getByText('Retourner à l’accueil')
    await user.press(homeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})
