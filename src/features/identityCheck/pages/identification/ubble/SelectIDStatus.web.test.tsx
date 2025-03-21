import React from 'react'

import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('SelectIDStatus', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SelectIDStatus />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
