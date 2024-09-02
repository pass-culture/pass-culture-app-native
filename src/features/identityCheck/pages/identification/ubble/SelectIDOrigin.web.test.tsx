import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
import { checkAccessibilityFor, fireEvent, render, screen, waitFor } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('selectIDOrigin', () => {
  it('should navigate to SelectPhoneStatus on press "J’ai une carte d’identité ou un passeport" HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const HeroButtonList = screen.getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.click(HeroButtonList)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectPhoneStatus', undefined)
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
