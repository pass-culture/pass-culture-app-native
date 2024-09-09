import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { FeedbackInApp } from './FeedbackInApp'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<FeedbackInApp/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<FeedbackInApp />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
