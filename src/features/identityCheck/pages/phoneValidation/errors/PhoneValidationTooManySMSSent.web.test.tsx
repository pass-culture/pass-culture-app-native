import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PhoneValidationTooManySMSSent } from './PhoneValidationTooManySMSSent'

describe('<PhoneValidationTooManySMSSent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const { container } = render(reactQueryProviderHOC(<PhoneValidationTooManySMSSent />))
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
