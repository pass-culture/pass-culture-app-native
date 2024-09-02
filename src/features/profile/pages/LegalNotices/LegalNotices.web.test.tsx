import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { LegalNotices } from './LegalNotices'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('LegalNotices', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<LegalNotices />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
