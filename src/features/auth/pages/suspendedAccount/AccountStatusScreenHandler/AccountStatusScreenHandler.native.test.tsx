import React from 'react'

import { AccountState } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { render, screen } from 'tests/utils'

import { AccountStatusScreenHandler } from './AccountStatusScreenHandler'

const mockSuspensionStatus = { status: AccountState.SUSPENDED_UPON_USER_REQUEST }
jest.mock('features/auth/queries/useAccountSuspensionStatusQuery', () => ({
  useAccountSuspensionStatusQuery: jest.fn(() => ({ data: mockSuspensionStatus })),
}))
jest.mock('features/auth/queries/useAccountSuspensionDateQuery', () => ({
  useAccountSuspensionDateQuery: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/auth/queries/useAccountUnsuspendMutation', () => ({
  useAccountUnsuspendMutation: jest.fn(() => ({ mutate: jest.fn() })),
}))
jest.mock('features/navigation/helpers/useCurrentRoute')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))
const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers/navigateToHome')
function mockUseCurrentRoute(name: string) {
  mockedUseCurrentRoute.mockReturnValue({ name, key: 'key' })
}

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountStatusScreenHandler />', () => {
  it('should display SuspendedAccountUponUserRequest component if account is suspended upon user request', () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED_UPON_USER_REQUEST
    render(<AccountStatusScreenHandler />)

    expect(screen.getByText('Ton compte est désactivé')).toBeOnTheScreen()
  })

  it('should display SuspiciousLoginSuspendedAccount component if account is suspended for suspicious login reported by user', () => {
    mockSuspensionStatus.status = AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER
    render(<AccountStatusScreenHandler />)

    expect(screen.getByText('Ton compte a été suspendu')).toBeOnTheScreen()
  })

  it('should display FraudulentSuspendedAccount component if account is suspended for fraud', () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED
    render(<AccountStatusScreenHandler />)

    expect(screen.getByText('Ton compte a été suspendu')).toBeOnTheScreen()
  })

  it('should redirect to home if account is not suspended', () => {
    mockSuspensionStatus.status = AccountState.ACTIVE
    render(<AccountStatusScreenHandler />)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should call sign out function on component unmount', () => {
    mockUseCurrentRoute('TabNavigator')
    render(<AccountStatusScreenHandler />)

    screen.unmount()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('should not call sign out function if user is redirect to reactivation success screen', () => {
    mockUseCurrentRoute('AccountReactivationSuccess')
    render(<AccountStatusScreenHandler />)

    screen.unmount()

    expect(mockSignOut).not.toHaveBeenCalled()
  })
})
