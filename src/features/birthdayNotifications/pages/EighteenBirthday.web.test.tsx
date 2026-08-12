import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { EighteenBirthday } from './EighteenBirthday'

jest.mock('shared/user/useDepositAmountsByAge')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

jest.mock('libs/firebase/analytics/analytics')

describe('<EighteenBirthday/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<EighteenBirthday />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
