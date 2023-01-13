import React from 'react'
import waitForExpect from 'wait-for-expect'

import { AccountState } from 'api/gen'
import { navigateToHome, useCurrentRoute } from 'features/navigation/helpers'
import { render } from 'tests/utils'

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
jest.mock('features/auth/logout/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))
const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers')
function mockUseCurrentRoute(name: string) {
  mockedUseCurrentRoute.mockReturnValue({ name, key: 'key' })
}

describe('<SuspensionsScreen />', () => {
  it('should display SuspendedAccount component if account is suspended upon user request', async () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED_UPON_USER_REQUEST
    const { getByText } = render(<SuspensionScreen />)
    expect(getByText('Ton compte est désactivé')).toBeTruthy()
  })

  it('should display FraudulentAccount component if account is suspended for fraud', async () => {
    mockSuspensionStatus.status = AccountState.SUSPENDED
    const { getByText } = render(<SuspensionScreen />)
    expect(getByText('Ton compte a été suspendu')).toBeTruthy()
  })

  it('should redirect to home if account is not suspended', async () => {
    mockSuspensionStatus.status = AccountState.ACTIVE
    render(<SuspensionScreen />)

    await waitForExpect(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should call sign out function on component unmount', async () => {
    mockUseCurrentRoute('TabNavigator')
    const { unmount } = render(<SuspensionScreen />)

    unmount()
    await waitForExpect(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call sign out function if user is redirect to reactivation success screen', async () => {
    mockUseCurrentRoute('AccountReactivationSuccess')
    const { unmount } = render(<SuspensionScreen />)

    unmount()
    await waitForExpect(() => {
      expect(mockSignOut).not.toBeCalled()
    })
  })
})
