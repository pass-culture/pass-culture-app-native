import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<RecreditBirthdayNotification/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
      expect(
        screen.getByText('Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.')
      ).toBeInTheDocument()
    })
  })
})
