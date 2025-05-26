import React from 'react'

import { OnboardingTimeline } from 'features/onboarding/components/OnboardingTimeline'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { render, screen } from 'tests/utils'

jest.mock('shared/user/useDepositAmountsByAge')
const mockUseDepositAmountsByAge = useDepositAmountsByAge as jest.Mock
mockUseDepositAmountsByAge.mockReturnValue({ eighteenYearsOldDeposit: '300 €' })

describe('OnboardingTimeline', () => {
  it('should display seventeen years old block', () => {
    render(<OnboardingTimeline age={17} />)

    const blockTitle = screen.getByText(`à 17 ans`)

    expect(blockTitle).toBeOnTheScreen()
  })

  it('should display eighteen years old block', () => {
    render(<OnboardingTimeline age={18} />)

    const blockTitle = screen.getByText(`à 18 ans`)

    expect(blockTitle).toBeOnTheScreen()
  })

  it('should display eighteen years old description', () => {
    render(<OnboardingTimeline age={18} />)

    const description = screen.getByText(
      'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
    )

    expect(description).toBeOnTheScreen()
  })
})
