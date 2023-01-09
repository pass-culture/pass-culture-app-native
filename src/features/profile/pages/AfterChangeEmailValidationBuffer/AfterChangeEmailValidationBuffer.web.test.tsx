import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AfterChangeEmailValidationBuffer } from './AfterChangeEmailValidationBuffer'

jest.mock('react-query')

describe('<AfterChangeEmailValidationBuffer/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AfterChangeEmailValidationBuffer />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
