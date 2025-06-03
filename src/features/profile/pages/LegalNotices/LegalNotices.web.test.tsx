import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { LegalNotices } from './LegalNotices'

jest.mock('libs/firebase/analytics/analytics')

describe('LegalNotices', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<LegalNotices />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
