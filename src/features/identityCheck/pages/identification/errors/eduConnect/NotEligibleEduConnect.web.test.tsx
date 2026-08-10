import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { NotEligibleEduConnect } from './NotEligibleEduConnect'

jest.mock('libs/firebase/analytics/analytics')

describe('<NotEligibleEduConnect/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <NotEligibleEduConnect
          error={{ name: 'toto', message: 'toto' }}
          resetErrorBoundary={jest.fn()}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
