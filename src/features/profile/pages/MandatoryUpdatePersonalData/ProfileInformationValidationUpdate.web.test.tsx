import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ProfileInformationValidationUpdate } from './ProfileInformationValidationUpdate'

jest.mock('features/auth/context/AuthContext')

describe('ProfileInformationValidationUpdate', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ProfileInformationValidationUpdate />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
