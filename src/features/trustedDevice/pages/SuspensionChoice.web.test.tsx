import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspensionChoice } from './SuspensionChoice'

describe('<SuspensionChoice/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspensionChoice />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
