import React from 'react'

import { UnlockEighteenCredit } from 'features/identityCheck/pages/UnlockEighteenCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('shared/user/useDepositAmountsByAge')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

jest.mock('libs/firebase/analytics/analytics')

describe('<UnlockEighteenCredit/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<UnlockEighteenCredit />))
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
