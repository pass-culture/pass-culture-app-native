import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { AccessibilityDeclarationMobileAndroid } from './AccessibilityDeclarationMobileAndroid'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccessibilityDeclarationMobileAndroid />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityDeclarationMobileAndroid />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    }, 15_000) // we increase the timeout to 15s because axe-core can be slow on CI
  })
})
