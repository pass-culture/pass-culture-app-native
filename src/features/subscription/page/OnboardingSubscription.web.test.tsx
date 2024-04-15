import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

describe('OnboardingSubscription', () => {
  it('should render correctly', () => {
    const { container } = render(reactQueryProviderHOC(<OnboardingSubscription />))

    expect(container).toMatchSnapshot()
  })
})
