import React from 'react'

import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<DisableActivation/>', () => {
  beforeEach(() => setFeatureFlags())

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DisableActivation />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
