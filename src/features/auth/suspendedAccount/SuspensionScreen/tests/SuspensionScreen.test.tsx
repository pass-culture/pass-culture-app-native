import React from 'react'
import waitForExpect from 'wait-for-expect'

import { AccountState } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { render } from 'tests/utils'

import { SuspensionScreen } from '../SuspensionScreen'

const mockSettings = {
  allowAccountReactivation: true,
}

const mockSuspensionStatus = { status: AccountState.SUSPENDED_UPON_USER_REQUEST }
jest.mock('features/auth/suspendedAccount/SuspensionScreen/useAccountSuspensionStatus', () => ({
  useAccountSuspensionStatus: jest.fn(() => ({ data: mockSuspensionStatus })),
}))
jest.mock('features/auth/suspendedAccount/SuspendedAccount/useAccountSuspensionDate', () => ({
  useAccountSuspensionDate: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))
const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

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
      expect(navigateToHome).toBeCalled()
    })
  })

  it('should call sign out function on component unmount', async () => {
    const { unmount } = render(<SuspensionScreen />)

    unmount()
    await waitForExpect(() => {
      expect(mockSignOut).toBeCalled()
    })
  })

  it('should redirect to home if feature is disabled', async () => {
    mockSettings.allowAccountReactivation = false
    render(<SuspensionScreen />)

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })
})
