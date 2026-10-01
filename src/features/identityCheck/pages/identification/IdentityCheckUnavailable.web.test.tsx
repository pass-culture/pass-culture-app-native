import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { IdentityCheckUnavailable } from './IdentityCheckUnavailable'

jest.mock('libs/firebase/analytics/analytics')

describe('<IdentityCheckUnavailable/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckUnavailable />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
