import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckPending } from './IdentityCheckPending'

jest.mock('libs/firebase/analytics/analytics')

describe('<IdentityCheckPending/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckPending />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
