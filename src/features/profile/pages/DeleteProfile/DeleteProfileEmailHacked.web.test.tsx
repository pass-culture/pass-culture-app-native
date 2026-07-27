import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileEmailHacked', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileEmailHacked />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
