import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspensionConfirmation } from './SuspensionConfirmation'

jest.mock('react-query')

describe('<SuspensionConfirmation/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspensionConfirmation />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
