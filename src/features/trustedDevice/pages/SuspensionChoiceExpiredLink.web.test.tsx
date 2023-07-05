import React from 'react'

import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { render, screen, checkAccessibilityFor } from 'tests/utils/web'

describe('<SuspensionChoiceExpiredLink/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionChoiceExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspensionChoiceExpiredLink />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
