import React from 'react'

import { PreValidationSignupStep } from 'features/auth/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { QuitSignupModal } from './QuitSignupModal'

jest.mock('libs/firebase/analytics/analytics')

describe('<QuitSignupModal/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <QuitSignupModal signupStep={PreValidationSignupStep.Birthday} resume={jest.fn()} visible />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
