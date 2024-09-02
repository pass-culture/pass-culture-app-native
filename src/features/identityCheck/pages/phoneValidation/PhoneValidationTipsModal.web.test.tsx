import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PhoneValidationTipsModal } from './PhoneValidationTipsModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<PhoneValidationTipsModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <PhoneValidationTipsModal isVisible dismissModal={jest.fn()} onGoBack={jest.fn()} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
