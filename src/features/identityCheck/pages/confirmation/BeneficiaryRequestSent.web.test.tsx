import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

describe('<BeneficiaryRequestSent/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = render(<BeneficiaryRequestSent />)

      await screen.findByLabelText('On y va !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
