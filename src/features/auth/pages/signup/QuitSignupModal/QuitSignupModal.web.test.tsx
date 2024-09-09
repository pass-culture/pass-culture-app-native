import React from 'react'

import { SignupStep } from 'features/auth/enums'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { QuitSignupModal } from './QuitSignupModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<QuitSignupModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <QuitSignupModal signupStep={SignupStep.Birthday} resume={jest.fn()} visible />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
