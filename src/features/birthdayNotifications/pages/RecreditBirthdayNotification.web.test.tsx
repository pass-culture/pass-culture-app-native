import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<RecreditBirthdayNotification/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
      expect(
        screen.getByText('Tu as jusqu’à la veille de tes 18 ans pour profiter de ton crédit.')
      ).toBeInTheDocument()
    })
  })
})
