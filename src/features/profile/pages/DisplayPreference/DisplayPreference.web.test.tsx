import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DisplayPreference } from './DisplayPreference'

describe('DisplayPreference', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<DisplayPreference />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
