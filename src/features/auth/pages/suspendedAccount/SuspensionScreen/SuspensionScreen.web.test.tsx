import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SuspensionScreen } from './SuspensionScreen'

jest.mock('react-query')

describe('<SuspensionScreen/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspensionScreen />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
