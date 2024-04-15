import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(screen).toMatchSnapshot()
  })
})
