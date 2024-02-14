import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

describe('<SuspendedAccountUponUserRequest/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<SuspendedAccountUponUserRequest />))
      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
