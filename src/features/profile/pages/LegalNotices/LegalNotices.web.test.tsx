import React from 'react'

import { flushAllPromisesWithAct, render, checkAccessibilityFor } from 'tests/utils/web'

import { LegalNotices } from './LegalNotices'

async function renderProfile() {
  const wrapper = render(<LegalNotices />)
  await flushAllPromisesWithAct()
  return wrapper
}

describe('LegalNotices', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = await renderProfile()
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
