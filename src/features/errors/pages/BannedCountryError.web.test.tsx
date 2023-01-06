import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BannedCountryError } from './BannedCountryError'

jest.mock('react-query')

describe('<BannedCountryError/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BannedCountryError />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
