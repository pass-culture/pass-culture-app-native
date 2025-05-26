import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { VerifyEligibility } from './VerifyEligibility'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<VerifyEligibility/>', () => {
  beforeEach(() => setFeatureFlags())

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<VerifyEligibility />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
