import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
import { checkAccessibilityFor, fireEvent, render, screen, waitFor } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('selectIDOrigin', () => {
  it('should navigate to SelectPhoneStatus on press "J’ai une carte d’identité ou un passeport" HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const HeroButtonList = screen.getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.click(HeroButtonList)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'SelectPhoneStatus',
      })
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SelectIDOrigin />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
