import React from 'react'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { EighteenBirthday } from './EighteenBirthday'

jest.mock('features/auth/api')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

jest.mock('features/auth/signup/useNextSubscriptionStep')
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
