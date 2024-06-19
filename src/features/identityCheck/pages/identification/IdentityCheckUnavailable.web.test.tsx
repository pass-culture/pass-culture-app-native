import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { IdentityCheckUnavailable } from './IdentityCheckUnavailable'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<IdentityCheckUnavailable/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckUnavailable />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
