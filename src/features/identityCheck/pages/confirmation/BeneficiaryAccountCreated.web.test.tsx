import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { BeneficiaryAccountCreated } from './BeneficiaryAccountCreated'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

describe('<BeneficiaryAccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(reactQueryProviderHOC(<BeneficiaryAccountCreated />))

      await screen.findByLabelText('C’est parti !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
