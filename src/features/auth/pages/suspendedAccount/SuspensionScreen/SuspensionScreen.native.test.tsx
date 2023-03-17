import React from 'react'

import { AccountState } from 'api/gen'
import { navigateToHome, useCurrentRoute } from 'features/navigation/helpers'
import { render, screen } from 'tests/utils'

import { SuspensionScreen } from './SuspensionScreen'

const mockSuspensionStatus = { status: AccountState.SUSPENDED_UPON_USER_REQUEST }
jest.mock('features/auth/api/useAccountSuspensionStatus', () => ({
  useAccountSuspensionStatus: jest.fn(() => ({ data: mockSuspensionStatus })),
}))
jest.mock('features/auth/api/useAccountSuspensionDate', () => ({
  useAccountSuspensionDate: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/auth/api/useAccountUnsuspend', () => ({
  useAccountUnsuspend: jest.fn(() => ({ mutate: jest.fn() })),
}))
jest.mock('features/navigation/helpers')
jest.mock('features/auth/context/SettingsContext')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))
const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers')
function mockUseCurrentRoute(name: string) {
  mockedUseCurrentRoute.mockReturnValue({ name, key: 'key' })
}

describe('<SuspensionsScreen />', () => {
  it('should display SuspendedAccount component if account is suspended upon user request', () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED_UPON_USER_REQUEST
    render(<SuspensionScreen />)

    expect(screen.getByText('Ton compte est désactivé')).toBeTruthy()
  })

  it('should display FraudulentAccount component if account is suspended for fraud', () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED
    render(<SuspensionScreen />)

    expect(screen.getByText('Ton compte a été suspendu')).toBeTruthy()
  })

  it('should redirect to home if account is not suspended', () => {
    mockSuspensionStatus.status = AccountState.ACTIVE
    render(<SuspensionScreen />)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should call sign out function on component unmount', () => {
    mockUseCurrentRoute('TabNavigator')
    render(<SuspensionScreen />)

    screen.unmount()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('should not call sign out function if user is redirect to reactivation success screen', () => {
    mockUseCurrentRoute('AccountReactivationSuccess')
    render(<SuspensionScreen />)

    screen.unmount()

    expect(mockSignOut).not.toBeCalled()
  })
})
