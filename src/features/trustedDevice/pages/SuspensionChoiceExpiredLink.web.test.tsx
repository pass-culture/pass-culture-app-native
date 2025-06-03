import React from 'react'

import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

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
