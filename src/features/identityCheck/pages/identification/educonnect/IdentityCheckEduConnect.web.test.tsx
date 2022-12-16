import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnect'
import { fireEvent, render, checkAccessibilityFor } from 'tests/utils/web'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const mockOpenEduConnectTab = jest.fn()
jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLogin').mockReturnValue({
  openEduConnectTab: mockOpenEduConnectTab,
  loginUrl: 'https://login/?redirect=false',
  error: null,
})

describe('<IdentityCheckEduConnect />', () => {
  it('should navigate to next screen and open educonnect tab on press "Connexion avec ÉduConnect"', () => {
    const { getByText } = render(<IdentityCheckEduConnect />)
    const button = getByText('Connexion avec ÉduConnect')

    fireEvent.click(button)

    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    expect(mockOpenEduConnectTab).toHaveBeenCalledTimes(1)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckEduConnect />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
