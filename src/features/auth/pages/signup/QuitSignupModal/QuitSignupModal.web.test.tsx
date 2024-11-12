import React from 'react'

import { SignupStep } from 'features/auth/enums'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { QuitSignupModal } from './QuitSignupModal'

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
