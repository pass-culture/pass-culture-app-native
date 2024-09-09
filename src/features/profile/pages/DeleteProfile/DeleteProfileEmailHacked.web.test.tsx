import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileEmailHacked } from './DeleteProfileEmailHacked'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('DeleteProfileEmailHacked', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileEmailHacked />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
