import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { render, screen } from 'tests/utils'

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    render(<OnboardingSubscription />)

    expect(screen).toMatchSnapshot()
  })
})
