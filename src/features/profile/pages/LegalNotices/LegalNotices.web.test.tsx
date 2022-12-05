import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { LegalNotices } from './LegalNotices'

describe('LegalNotices', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<LegalNotices />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
