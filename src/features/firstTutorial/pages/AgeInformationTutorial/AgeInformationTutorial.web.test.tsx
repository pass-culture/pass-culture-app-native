import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeInformationTutorial } from './AgeInformationTutorial'

describe('<AgeInformationTutorial/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AgeInformationTutorial />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
