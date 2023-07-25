import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

jest.mock('react-query')

describe('<SuspendedAccountUponUserRequest/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspendedAccountUponUserRequest />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
