import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { AccountCreated } from './AccountCreated'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/firebase/analytics/analytics')

describe('<AccountCreated/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccountCreated />)

      await screen.findByLabelText('On y va !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
