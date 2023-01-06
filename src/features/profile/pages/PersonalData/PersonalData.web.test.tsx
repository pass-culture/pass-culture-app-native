import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PersonalData } from './PersonalData'

describe('<PersonalData/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<PersonalData />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
