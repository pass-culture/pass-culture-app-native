import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

import { AccountReactivationSuccess } from '../AccountReactivationSuccess'

const mockSettings = {
  allowAccountReactivation: true,
}

jest.mock('features/navigation/helpers')
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('<AccountReactivationSuccess />', () => {
  it('should match snapshot', () => {
    expect(render(<AccountReactivationSuccess />)).toMatchSnapshot()
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByText } = render(<AccountReactivationSuccess />)

    const homeButton = getByText('Découvrir le catalogue')
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
    })
  })

  it('should redirect to home if feature is disabled', async () => {
    mockSettings.allowAccountReactivation = false
    render(<AccountReactivationSuccess />)

    await waitForExpect(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})
