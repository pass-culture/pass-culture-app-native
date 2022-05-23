import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

import { SuspendedAccount } from '../SuspendedAccount'

const mockSettings = {
  allowAccountReactivation: true,
}

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

describe('<SuspendedAccount />', () => {
  it('should match snapshot', () => {
    expect(render(<SuspendedAccount />)).toMatchSnapshot()
  })

  it('should go back when clicking on go back icon', async () => {
    const { getByTestId } = render(<SuspendedAccount />)

    const leftIconButton = getByTestId('Revenir en arrière')
    fireEvent.press(leftIconButton)

    await waitForExpect(() => {
      expect(mockGoBack).toBeCalledTimes(1)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByTestId } = render(<SuspendedAccount />)

    const homeButton = getByTestId("Retourner à l'accueil")
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })

  it('should redirect to home if feature is disabled', async () => {
    mockSettings.allowAccountReactivation = false
    render(<SuspendedAccount />)

    await waitForExpect(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})
