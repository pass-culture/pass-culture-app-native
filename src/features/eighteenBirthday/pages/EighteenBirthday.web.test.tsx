import React from 'react'

import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { useDepositAmountsByAge } from 'features/auth/helpers/useDepositAmountsByAge'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { EighteenBirthday } from './EighteenBirthday'

jest.mock('features/auth/helpers/useDepositAmountsByAge')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

jest.mock('features/auth/api/useNextSubscriptionStep')
const mockUseNextSubscriptionStep = useNextSubscriptionStep as jest.Mock
mockUseNextSubscriptionStep.mockReturnValue({ navigateToNextBeneficiaryValidationStep: jest.fn() })

describe('<EighteenBirthday/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<EighteenBirthday />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
