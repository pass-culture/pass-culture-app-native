import React from 'react'

import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
