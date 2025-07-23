import React from 'react'

import { OnboardingCreditBlockTitle } from 'features/onboarding/components/OnboardingCreditBlockTitle'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'

describe('CreditBlockTitle', () => {
  it('should return correct text for expired credit', () => {
    render(<OnboardingCreditBlockTitle age={15} userAge={16} deposit="20&nbsp;€" />)

    expect(screen.getByText('20\u00a0€')).toBeOnTheScreen()
  })

  it('should return correct text for ongoing credit', () => {
    render(<OnboardingCreditBlockTitle age={16} userAge={16} deposit="20&nbsp;€" />)

    expect(screen.getByText('20\u00a0€')).toBeOnTheScreen()
  })

  it('should return correct text for 18 years old credit', () => {
    render(<OnboardingCreditBlockTitle age={18} userAge={16} deposit="300&nbsp;€" />)

    expect(screen.getByText('300\u00a0€')).toBeOnTheScreen()
  })

  it('should return secondary text for ongoing credit', () => {
    render(<OnboardingCreditBlockTitle age={15} userAge={15} deposit="20&nbsp;€" />)

    expect(screen.getByText('20\u00a0€')).toHaveStyle({
      color: theme.designSystem.color.text.brandSecondary,
    })
  })

  it('should return correct text for coming credit', () => {
    render(<OnboardingCreditBlockTitle age={17} userAge={16} deposit="20&nbsp;€" />)

    expect(screen.getByText('+ 20\u00a0€')).toBeOnTheScreen()
  })
})
